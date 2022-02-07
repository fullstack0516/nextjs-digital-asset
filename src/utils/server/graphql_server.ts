import { Client, CombinedError, } from "@urql/core";
import { NextApiRequest, NextApiResponse } from "next";
import { Page } from "../../models/page";
import { Site } from "../../models/site";
import { WebsiteStatus } from "../../models/website-status";
import { makeGraphqlClient } from "../client/graphql-client";
import { BlacklistedDataCategory } from "../../models/blacklisted-data-category";
import { UserDataTag } from "../../models/user-data-tag";
import { User } from "../../models/user";
import { UserLight } from "../../models/user-light";
import * as userQueries from "../graphql/user_queries";
import * as pageQueries from "../graphql/page_queries";
import * as siteQueries from "../graphql/site_queries";
import * as adminQueries from "../graphql/admin_queries";
import * as commentQueries from "../graphql/comment_queries";
import { PageLike } from "../../models/page-like";
import { Comment } from "../../models/comment";
import { Video } from "../../models/video";
// import { SubscriptionClient } from "subscriptions-transport-ws";

export let graphqlServer: Client

export const server = async (props: { req: NextApiRequest, res: NextApiResponse }): Promise<{ isLoggedIn: boolean }> => {
    const jwt = props.req?.cookies['jwt'] as string
    const url = props.req?.cookies['server-url'] as string

    let isLoggedIn = false;
    if (jwt !== 'null') {
        isLoggedIn = await checkValidToken(url, jwt);
    }

    graphqlServer = makeGraphqlClient(url, jwt)

    return {
        isLoggedIn
    }
}

export const checkValidToken = async (url: string, jwt: string): Promise<boolean> => {
    const res = await makeGraphqlClient(url)
        .query(userQueries.checkValidTokenQuery, { jwt })
        .toPromise();

    if (res.error) {
        return false
    }

    return res.data.checkValidToken === 'success';
}


export const fetchWebsiteStatus = async (): Promise<WebsiteStatus> => {
    const res = await graphqlServer.query(userQueries.WebsiteStatusQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.fetchWebsiteStatus.websiteStatus;
};

export const discoverFetchHomePagesSF = async (props: { itemNumber: number, category?: string }): Promise<{ itemNumber: number, pages: Page[] }> => {
    const { itemNumber, category } = props
    const res = await graphqlServer.query(pageQueries.discoverFetchHomePagesQuery, {
        itemNumber,
        category,
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.discoverFetchHomePages;
};

export const discoverFetchPopularPagesSF = async (props: { itemNumber: number, category?: string }): Promise<{ itemNumber: number, pages: Page[] }> => {
    const { itemNumber, category } = props
    const res = await graphqlServer.query(pageQueries.discoverFetchPopularPagesQuery, {
        itemNumber,
        category,
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.discoverFetchPopularPages;
};

export const discoverFetchTrendingPagesSF = async (props: { itemNumber: number, category?: string }): Promise<{ itemNumber: number, pages: Page[] }> => {
    const { itemNumber, category } = props
    const res = await graphqlServer.query(pageQueries.discoverFetchTrendingPagesQuery, {
        itemNumber,
        category,
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.discoverFetchTrendingPages;
};

export const discoverFetchNewPagesSF = async (props: { fromIso?: string, category?: string }): Promise<{ pages: Page[] }> => {
    const { fromIso, category } = props
    const res = await graphqlServer.query(pageQueries.discoverFetchNewPagesQuery, {
        fromIso,
        category,
    }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.discoverFetchNewPages;
};

export const fetchSiteSF = async (siteUid: string): Promise<Site> => {
    const res = await graphqlServer.query(siteQueries.fetchSiteQuery, { siteUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchSite.site;
};

export const fetchSiteViaUrlSF = async (props: { siteUrl: string }): Promise<Site | null> => {
    const res = await graphqlServer.query(siteQueries.fetchSiteViaUrlQuery, { siteUrl: props.siteUrl }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)

        return null
    }

    return res.data.fetchSiteViaUrl.site;
};

export const fetchSitePagesRecentUpdatesSF = async (props: { siteUid: string, fromIso: string }): Promise<Page[]> => {
    const { siteUid, fromIso } = props
    const res = await graphqlServer.query(pageQueries.fetchSitePagesRecentUpdatesQuery, { siteUid, fromIso }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchSitePagesRecentUpdates.pages;
};

export const fetchMySitesSF = async (props: { fromIso?: string }): Promise<Site[]> => {
    const res = await graphqlServer.query(siteQueries.fetchMySitesQuery, { fromIso: props.fromIso }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchMySites.sites;
};


export const fetchSubscribedSitesSF = async (): Promise<Site[]> => {
    const res = await graphqlServer.query(siteQueries.fetchSubscribedSitesQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return []
    }

    return res.data.fetchSubscribedSites.sites;
};

export const fetchDataPointsCountSF = async (): Promise<number> => {
    const res = await graphqlServer.query(userQueries.fetchDataPointsCountQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchDataPointsCount.count;
};

export const fetchMyDataSF = async (props: { fromIso: string, category?: string }): Promise<{ [category: string]: UserDataTag[] }> => {
    const { fromIso, category } = props
    const res = await graphqlServer.query(userQueries.fetchMyDataQuery, { fromIso, category }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    // TODO: later check since myData is map but for now we just use string
    return JSON.parse(res.data.fetchMyData.myData);
};

export const getBlacklistedCategoriesSF = async (): Promise<BlacklistedDataCategory[]> => {
    const res = await graphqlServer.query(userQueries.getBlacklistedCategoriesQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.getBlacklistedCategories.blacklistedCategories;
};

export const fetchPageViaUrlSF = async (props: { url: string }): Promise<{
    page: Page,
    newPagesFromSite: Page[],
    popularPagesFromSite: Page[],
    trendingPageFromSite: Page[]
}> => {
    const res = await graphqlServer.query(pageQueries.fetchPageViaUrlQuery, { url: props.url }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        throw res.error
    }

    return res.data.fetchPageViaUrl;
};

export const adminFetchUsersCountSF = async (): Promise<{ count: number }> => {
    const res = await graphqlServer.query(adminQueries.adminFetchUsersCountQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchUsersCount;
};

export const adminFetchNewUsersCountSF = async (props: { daysNAgo: number }): Promise<{ count: number, rate: number }> => {
    const res = await graphqlServer.query(adminQueries.adminFetchNewUsersCountQuery, { daysNAgo: props.daysNAgo }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchNewUsersCount;
};

export const adminFetchNewSitesCountSF = async (props: { daysNAgo: number }): Promise<{ count: number, rate: number }> => {
    const res = await graphqlServer.query(adminQueries.adminFetchNewSitesCountQuery, { daysNAgo: props.daysNAgo }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchNewSitesCount;
};

export const adminFetchNewUsersSF = async (props: { fromIso: string }): Promise<User[]> => {
    const res = await graphqlServer.query(adminQueries.adminFetchNewUsersQuery, { fromIso: props.fromIso }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchNewUsers.users;
};

export const adminFetchDataPointsCountSF = async (): Promise<{ count: number }> => {
    const res = await graphqlServer.query(adminQueries.adminFetchDataPointsCountQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchDataPointsCount;
};

export const adminFetchNewPagesSF = async (props: { showCount: number, pageNum: number }): Promise<{ totalCount: number, pages: Page[] }> => {
    const { showCount, pageNum } = props
    const res = await graphqlServer.query(adminQueries.adminFetchNewPagesQuery, { showCount, pageNum }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchNewPages;
};

export const adminFetchSitesSF = async (props: { showCount: number, pageNum: number }): Promise<{ totalCount: number, sites: Site[] }> => {
    const { showCount, pageNum } = props
    const res = await graphqlServer.query(adminQueries.adminFetchSitesQuery, { showCount, pageNum }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchSites;
};

export const adminFetchUsersSF = async (props: { showCount: number, pageNum: number }): Promise<{ totalCount: number, users: User[] }> => {
    const { showCount, pageNum } = props
    const res = await graphqlServer.query(adminQueries.adminFetchUsersQuery, { showCount, pageNum }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchUsers;
};

export const adminFetchVideosSF = async (props: { showCount: number, pageNum: number }): Promise<{ totalCount: number, videos: Video[] }> => {
    const { showCount, pageNum } = props
    const res = await graphqlServer.query(adminQueries.adminFetchVideosQuery, { showCount, pageNum }).toPromise();
    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchVideos;
}

export const adminFetchVideoSF = async (props: { uid: string }): Promise<{ video: Video }> => {
    const { uid } = props
    const res = await graphqlServer.query(adminQueries.adminFetchVideoQuery, { uid }).toPromise();
    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.adminFetchVideo;
}

export const fetchSiteViaUrlPublicSF = async (props: { siteUrl: string }): Promise<{
    site: Site,
    newPagesFromSite: Page[]
    popularPagesFromSite: Page[]
    trendingPageFromSite: Page[]
}> => {
    const res = await graphqlServer.query(pageQueries.fetchSiteViaUrlPublicQuery, { siteUrl: props.siteUrl }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchSiteViaUrlPublic;
};

export const fetchPageViaUrlPublicSF = async (props: { url: string }): Promise<{
    page: Page,
    newPagesFromSite: Page[]
    popularPagesFromSite: Page[]
    trendingPageFromSite: Page[]
}> => {
    const res = await graphqlServer.query(pageQueries.fetchPageViaUrlPublicQuery, { url: props.url }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchPageViaUrlPublic;
};

export const fetchMoreTrendingPagesSF = async (props: { siteUid: string, totalVisits?: number }): Promise<Page[]> => {
    const { siteUid, totalVisits } = props
    const res = await graphqlServer.query(pageQueries.fetchMoreTrendingPagesQuery, { siteUid, totalVisits }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchMoreTrendingPages.trendingPageFromSite;
};

export const fetchMorePopularPagesSF = async (props: { siteUid: string, totalVisits?: number }): Promise<Page[]> => {
    const { siteUid, totalVisits } = props
    const res = await graphqlServer.query(pageQueries.fetchMorePopularPagesQuery, { siteUid, totalVisits }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchMorePopularPages.popularPagesFromSite;
};

export const fetchMoreNewPagesSF = async (props: { siteUid: string, fromIso?: number }): Promise<Page[]> => {
    const { siteUid, fromIso } = props
    const res = await graphqlServer.query(pageQueries.fetchMoreNewPagesQuery, { siteUid, fromIso }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchMoreNewPages.newPagesFromSite;
};

export const checkSiteSubscribedSF = async (props: { siteUid: string }): Promise<boolean> => {
    const res = await graphqlServer.query(userQueries.checkSiteSubscribedQuery, { siteUid: props.siteUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.checkSubscribedSite.isSubscribed;
};

export const fetchUserSF = async (): Promise<User> => {
    const res = await graphqlServer.query(userQueries.fetchUserQuery).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchUser.user;
};

export const fetchUserLightSF = async (props: { userLightUid: string }): Promise<UserLight | null> => {
    const res = await graphqlServer.query(userQueries.fetchUserLightQuery, { userLightUid: props.userLightUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.fetchUserLight.userLight;
};

export const recordPageVisitSF = async (props: { pageUid: string }): Promise<string> => {
    const res = await graphqlServer.mutation(pageQueries.recordPageVisitQuery, { pageUid: props.pageUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.recordPageVisit
};

export const fetchCommentsSF = async (props: { pageUid: string }): Promise<Comment[]> => {
    const res = await graphqlServer.query(commentQueries.fetchCommentsQuery, { pageUid: props.pageUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return []
    }

    return res.data.fetchComments
};

export const fetchCountOfCommentsSF = async (props: { pageUid: string }): Promise<number> => {
    const res = await graphqlServer.query(commentQueries.fetchCountOfCommentsQuery, { pageUid: props.pageUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
        return 0
    }

    return res.data.fetchCountOfComments
};

export const recordPageTagsSF = async (props: { pageUid: string }): Promise<string> => {
    const res = await graphqlServer.mutation(pageQueries.recordPageTagsQuery, { pageUid: props.pageUid }).toPromise();

    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.recordPageTags.result;
};

export const fetchPageLikeSF = async (props: { pageUid: string }): Promise<PageLike> => {
    const res = await graphqlServer.query(pageQueries.fetchPageLikeQuery, { pageUid: props.pageUid }).toPromise();
    if (res.error) {
        graphqlErrorHandler(res.error)
    }

    return res.data.fetchPageLike.pageLike;
};

export const graphqlErrorHandler = (error: CombinedError) => {
    console.log(error)
}
