import { Page } from "../../models/page";
import { User } from "../../models/user";
import { Video } from "../../models/video";
import * as adminQueries from "../graphql/admin_queries";
import { graphqlClient, graphqlErrorHandler } from "./graphql-client";

/**
 * @param
 *      fromIso: string,
 * @returns
 *      User[]
 * fetch new users by fromIso
 */
export const adminFetchNewUsers = async (fromIso: string): Promise<User[]> => {
    const res = await graphqlClient.query(adminQueries.adminFetchNewUsersQuery, {
        fromIso
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.adminFetchNewUsers.users as User[];
}

/**
 * @param
 *      daysNAgo: number,
 * @returns
 *     {count: number, rate: number}
 * fetch new users count by fromIso
 */
export const adminFetchNewUsersCount = async (
    daysNAgo: number
): Promise<{ count: number, rate: number }> => {
    const res = await graphqlClient.query(adminQueries.adminFetchNewUsersCountQuery, {
        daysNAgo
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.adminFetchNewUsersCount;
}

/**
 * @param
 *      daysNAgo: number,
 * @returns
 *      {count: number, rate: number}
 * fetch new sites count by fromIso
 */
export const adminFetchNewSitesCount = async (daysNAgo: number): Promise<{ count: number, rate: number }> => {
    const res = await graphqlClient.query(adminQueries.adminFetchNewSitesCountQuery, {
        daysNAgo
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.adminFetchNewSitesCount;
}

/**
 * @param
 *      pageToUpdateUid: string
 *      isBanned?: boolean
 * @returns page: Page
 *
 * update the page by admin
 */
export const adminUpdatePage = async (props: {
    pageToUpdateUid: string,
    isBanned?: boolean
}): Promise<Page> => {
    const res = await graphqlClient.mutation(adminQueries.adminUpdatePageQuery, {
        pageToUpdateUid: props.pageToUpdateUid,
        isBanned: props.isBanned
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.adminUpdatePage.page as Page;
}

export const updateVideoStatus = async (props: { uid: string, intelligenceStatus: string }): Promise<Video | null> => {
    const res = await graphqlClient.mutation(adminQueries.adminUpdateVideoQuery, { uid: props.uid, intelligenceStatus: props.intelligenceStatus }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.adminUpdateVideo.video
};
