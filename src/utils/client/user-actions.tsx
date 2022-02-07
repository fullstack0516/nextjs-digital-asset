import axios from 'axios';
import { User } from '../../models/user';
import { axiosClient, graphqlClient, graphqlErrorHandler } from './graphql-client';
import { dispatchModal } from './modal-state';
import { dispatchUser } from './user-state';
import { logout } from './auth-actions';
import ModalError from '../../components/modal-error';
import { getLanguage } from '../../langauge/language';
import { MediaLink } from '../../models/media-link';
import { UserDataTag } from '../../models/user-data-tag';
import * as userQueries from '../graphql/user_queries';

/**
 * Fetch the logged in user.
 * If they are not logged in it return null.
 */
export const fetchUser = async (): Promise<User | null> => {
    const res = await Promise.all([
        graphqlClient.query(userQueries.fetchUserQuery).toPromise(),
        graphqlClient.query(userQueries.fetchUsersCoinAmountQuery).toPromise(),
    ])

    const userRes = res[0]
    const coinRes = res[1]
    if (userRes.error) {
        console.log(userRes.error);
        return null
    }


    dispatchUser({ type: 'setUser', data: userRes.data.fetchUser.user })
    dispatchUser({ type: 'setCoin', data: coinRes.data.fetchUsersCoinAmount })

    return userRes.data.fetchUser.user;
};

/**
 * update the logged in user profile.
 */
export const updateUser = async (props: {
    username?: string,
    email?: string,
    phoneNumber?: string,
    bio?: string,
    profileMedia?: MediaLink,
    lastOpenedAppIso?: string
}): Promise<User | null> => {
    const res = await graphqlClient.mutation(userQueries.updateUserQuery, {
        origin: window.location.origin,
        lastOpenedAppIso: props.lastOpenedAppIso,
        profileMedia: props.profileMedia,
        phoneNumber: props.phoneNumber,
        bio: props.bio,
        email: props.email,
        username: props.username
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    const user = res.data.updateUser.user as User;
    dispatchUser({
        type: 'setUser',
        data: user,
    });

    return user;
};

/**
 * update the logged in user profile.
 */
export const checkUsernameExist = async (username: string): Promise<boolean | null> => {
    const res = await graphqlClient.query(userQueries.checkUsernameExistQuery, { username }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.checkUsernameExist
};

/**
 * upload the photo of the logged in user profile.
 */
export const uploadPhoto = async (data: any): Promise<string | undefined> => {
    try {
        const req = await axiosClient.post('upload-photo', data);
        return req.data;
    } catch (e) {
        const { statusCode } = e.response?.data ?? {};
        if (statusCode) {
            if (statusCode === 'invalid-photo')
                dispatchModal({
                    type: 'add',
                    modal: <ModalError text={getLanguage().invalidPhoto} />,
                });
        }
        else {
            dispatchModal({
                type: 'add',
                modal: <ModalError text="" />,
            });
        }
        return null;
    }
}

type FileUploadUrlPayload = {
    fileName: string;
    fileType: string;
    pageUid: string;
    sectionUid: string;
  };
export const getFileUploadUrl = async (
    data: FileUploadUrlPayload
): Promise<{ tempUploadUrl: string; tempFileName: string; finalUrl: string; finalDestination: string }> => {
    const response = await axiosClient.post('create-file-upload-url', data);
    return response.data;
};

type ProcessVideoPayload = {
    fileName: string;
    tempFileName: string;
    pageUid: string;
    sectionUid: string;
    finalDestination: string;
    finalUrl: string;
  };
export const processVideo = async (data: ProcessVideoPayload): Promise<{ processing: true }> => {
    const response = await axiosClient.post('process-video', data);
    return response.data;
};

export const uploadAndProcess = async (data: FileUploadUrlPayload & { file: File }, onUploadProgress): Promise<{ videoUrl: string }> => {
  try {
    // Get video upload url
    const urlResponse = await getFileUploadUrl({
      fileName: data.fileName,
      fileType: data.fileType,
      pageUid: data.pageUid,
      sectionUid: data.sectionUid
    });

    // Upload to storage
    await axios.put(urlResponse.tempUploadUrl, data.file, {
      headers: {
        'Content-Type': data.fileType
      },
      onUploadProgress
    });

    // Send processing request
    await processVideo({
      fileName: data.fileName,
      tempFileName: urlResponse.tempFileName,
      pageUid: data.pageUid,
      sectionUid: data.sectionUid,
      finalDestination: urlResponse.finalDestination,
      finalUrl: urlResponse.finalUrl
    });

    return { videoUrl: urlResponse.finalUrl };
  } catch (error) {
    // TODO: Catch error
  }
};

/**
 *
 * @param verificationId : string
 * @param smsCode : string(4 numbers)
 * @param phoneNumber : string
 * @returns smsVerified: boolean
 *
 * return the result about if SMS was confirmed or not
 */
export const confirmChangeSMS = async (
    verificationId: string,
    smsCode: string,
    phoneNumber: string
): Promise<boolean | undefined> => {
    const res = await graphqlClient.mutation(userQueries.confirmChangeSMSQuery, {
        verificationId,
        smsCode,
        phoneNumber,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    const SMSVerified = res.data.confirmChangeSMS.SMSVerified as boolean;

    return SMSVerified;
};

/**
 *
 * @param code : string
 * @returns
 *
 * return the result about if backup email was verified.
 */
export const confirmBackupEmail = async (
    code: string
): Promise<User | undefined> => {
    const res = await graphqlClient.mutation(userQueries.confirmBackupEmailQuery, {
        code
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    const user = res.data.confirmBackupEmail.user as User
    dispatchUser({
        type: 'setUser',
        data: user,
    });
    return user;
}

/**
 *
 * @param data : <User>
 * @returns smsVerified: boolean
 *
 * return the user which have been deleted from site.
 */
export const deleteSelf = async () => {
    const res = await graphqlClient.mutation(userQueries.deleteSelfQuery).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null;
    }
    const user = res.data.deleteSelf.user as User
    if (user) {
        logout();
    }
}

/**
 *
 * @param
 *      fromIso: string,
 *      category?: string
 * @returns
 *      myData: <{[category: string]: UserDataTag[]}>
 *
 * fetch my data
 */
export const fetchMyData = async (
    fromIso: string,
    category?: string
): Promise<{
    myData: { [category: string]: UserDataTag[] },
    count: number
}> => {
    const res = await graphqlClient.query(userQueries.fetchMyDataQuery, {
        fromIso,
        category
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error);
        return null
    }

    // TODO: later check for map data
    return {
        myData: JSON.parse(res.data.fetchMyData.myData) as { [category: string]: UserDataTag[] },
        count: res.data.fetchMyData.count as number
    }
}

/**
 *
 * @param
 *      categoryName: string,
 * @returns
 *      status 200
 *
 * Set Category Blacklisted
 */
export const setCategoryBlacklisted = async (categoryName: string): Promise<boolean> => {
    const res = await graphqlClient.mutation(userQueries.setCategoryBlacklistedQuery, {
        categoryName
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.setCategoryBlacklisted === "success"
}

/**
 *
 * @param
 *      categoryName: string,
 * @returns
 *      status 200
 *
 * Set Category Unblacklisted
 */
export const setCategoryUnblacklisted = async (categoryName: string): Promise<boolean> => {
    const res = await graphqlClient.mutation(userQueries.setCategoryUnblacklistedQuery, {
        categoryName
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.setCategoryUnblacklisted === "success"
}

/**
 * @param
 *  siteUid:string
 *
 *  check user subscribed or not
 */
export const checkSiteSubscribed = async (siteUid: string): Promise<boolean> => {
    const res = await graphqlClient.query(userQueries.checkSiteSubscribedQuery, {
        siteUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return false
    }

    return res.data.checkSubscribedSite.isSubscribed as boolean;
}
