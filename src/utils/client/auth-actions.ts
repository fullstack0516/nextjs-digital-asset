import { User } from '../../models/user';
import { dispatchUser } from './user-state';
import { setAuthTokenHeaders, graphqlClient, graphqlErrorHandler } from './graphql-client';
import { dispatchAuth } from './auth-state';
import {
    confirmSMSCodeQuery,
    sendSmsCodeQuery,
    resendSmsCodeQuery
} from '../graphql/user_queries';

/**
 * 
 * @param phoneNumber 
 * @returns verificationId: string, userExist: boolean
 */
export const sendSMSCode = async (phoneNumber: string): Promise<{ verificationCode: string, userExists: boolean }> => {
    const res = await graphqlClient.mutation(sendSmsCodeQuery, { phoneNumber }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error);
        return { verificationCode: '', userExists: false }
    }

    return res.data.sendSmsCode;
};

export const resendSMSCode = async (verificationId: string, phoneNumber: string): Promise<string> => {
    const res = await graphqlClient.mutation(resendSmsCodeQuery, {
        verificationId,
        phoneNumber
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error);
    }

    return res.data.resendSmsCode;
};

/**
 * @param username if the username is null, it will try to sign in.
 *
 * This also fetches the users object and signs in.
 */
export const confirmSMS = async (verificationId: string, smsCode: string, phoneNumber: string, username: string): Promise<User | undefined> => {
    /**
     * Will sign-in if username is null.
     */
    const res = await graphqlClient.mutation(confirmSMSCodeQuery, {
        smsCode,
        verificationId,
        phoneNumber,
        username
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error);
        return;
    }

    const user = res.data.confirmSMSCode.user as User;
    const jwt = res.data.confirmSMSCode.jwt as string;

    setAuthTokenHeaders(jwt);

    dispatchUser({
        type: 'setUser',
        data: user,
    });

    dispatchAuth({
        type: 'setAuthToken',
        data: jwt,
    });

    console.info('User created and signed in.');

    return user;
};

export const logout = async () => {
    dispatchUser({
        type: 'logout',
    });
    dispatchAuth({
        type: 'logout',
    });
};
