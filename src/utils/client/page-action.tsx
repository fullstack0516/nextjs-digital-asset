import { graphqlClient, graphqlErrorHandler } from './graphql-client';
import { Page } from '../../models/page';
import { ContentSectionTypes } from '../../models/content-section';
import { dispatchPage } from './page-state';
import * as pageQueries from '../graphql/page_queries';

/**
 * 
 * @param pageUid : string
 * @param contentSectionType : ContentSectionTypes
 * @param index : number for position
 * @returns page: Page
 * 
 * return add the page-section
 */
export const pageSectionAdd = async (
    pageUid: string,
    contentSectionType: ContentSectionTypes,
    index?: number) => {
    const res = await graphqlClient.mutation(pageQueries.pageSectionAddQuery, {
        contentSectionType,
        pageUid,
        index
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    dispatchPage({ type: 'setPage', data: { ...res.data.pageSectionAdd.page as Page } });
}

/**
 * 
 * @returns page: Page
 * 
 * return update the page-section
 */
export const pageSectionUpdate = async (props: {
    pageUid: string,
    contentSectionUid: string,
    newImageUrl?: string,
    newText?: string,
    newTitle?: string,
    newVideoUrl?: string,
    processing?: boolean,
    deleteImage?: boolean,
    deleteVideoUrl?: boolean,
    nthImage?: number
}) => {
    const res = await graphqlClient.mutation(pageQueries.pageSectionUpdateQuery, {
        pageUid: props.pageUid,
        contentSectionUid: props.contentSectionUid,
        newImageUrl: props.newImageUrl,
        newText: props.newText,
        newTitle: props.newTitle,
        newVideoUrl: props.newVideoUrl,
        processing: props.processing,
        deleteImage: props.deleteImage,
        deleteVideoUrl: props.deleteVideoUrl,
        nthImage: props.nthImage
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    dispatchPage({ type: 'setPage', data: { ...res.data.pageSectionUpdate.page as Page } });
}

/**
 * @param pageUid : string
 * @param contentSectionUid : string
 * @returns page: Page
 * 
 * return update the page-section
 */
export const pageSectionDelete = async (
    pageUid: string,
    contentSectionUid: string
) => {
    const res = await graphqlClient.mutation(pageQueries.pageSectionDeleteQuery, {
        contentSectionUid,
        pageUid
    }).toPromise();
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    dispatchPage({ type: 'setPage', data: { ...res.data.pageSectionDelete.page as Page } });
}

/**
 * @param pageUid : string
 * @returns page: Page
 * 
 * return publish the page 
 */
export const pageSectionPublish = async (pageUid: string): Promise<Page> => {
    const res = await graphqlClient.mutation(pageQueries.pageSectionPublishQuery, {
        pageUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.pageSectionPublish.page as Page
}

/**
 * @param 
 *      pageUid : string
 *      fromIndex: number
 *      toIndex: number
 * @returns page: Page
 * 
 * reorder the page content
 */
export const pageSectionsReorder = async (
    pageUid: string,
    fromIndex: number,
    toIndex: number
) => {
    const res = await graphqlClient.mutation(pageQueries.pageSectionReorderQuery, {
        pageUid,
        fromIndex,
        toIndex
    }).toPromise()
    if (res.error) {
        //TODO confirm status-code
        graphqlErrorHandler(res.error)
        return null
    }
    dispatchPage({ type: 'setPage', data: { ...res.data.pageSectionsReorder.page as Page } });
}

/**
 * @param 
 *      pageToUpdateUid: string
 *      title?: string
 *      pageColor?: string
 *      isPublished?: boolean
 * @returns page: Page
 * 
 * update the page title
 */
export const updatePage = async (props: {
    pageToUpdateUid: string,
    title?: string,
    pageColor?: string,
    isPublished?: boolean
}) => {
    const res = await graphqlClient.mutation(pageQueries.updatePageQuery, {
        pageToUpdateUid: props.pageToUpdateUid,
        title: props.title,
        pageColor: props.pageColor,
        isPublished: props.isPublished
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    dispatchPage({ type: 'setPage', data: { ...res.data.updatePage.page as Page } });
}

/**
 * @param 
 *      pageUid: string
 *      newTagString?: string
 * @returns page: Page
 * 
 * add the new metaTag
 */
export const addMetaTag = async (props: {
    pageUid: string,
    newTagString: string,
}): Promise<boolean> => {
    const res = await graphqlClient.mutation(pageQueries.addMetaTagQuery, {
        pageUid: props.pageUid,
        newTagString: props.newTagString,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return false
    }

    dispatchPage({ type: 'setPage', data: { ...res.data.addMetaTag.page as Page } });
    return true
}

/**
 * @param 
 *      pageUid: string
 *      metaTagUid?: string
 * @returns page: Page
 * 
 * add the new metaTag
 */
export const removeMetaTag = async (props: {
    pageUid: string,
    metaTagUid: string,
}): Promise<boolean> => {
    const res = await graphqlClient.mutation(pageQueries.removeMetaTagQuery, {
        pageUid: props.pageUid,
        metaTagUid: props.metaTagUid,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return false
    }

    dispatchPage({ type: 'setPage', data: { ...res.data.removeMetaTag.page as Page } });
    return true
}

/**
 * @param 
 *      pageUid : string
 *      reasonDesc: string
 * 
 * report the page
 */
export const reportPage = async (
    pageUid: string,
    reasonDesc: string
) => {
    const res = await graphqlClient.mutation(pageQueries.reportPageQuery, {
        pageUid,
        reasonDesc
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
}

/**
 * @param 
 *      pageUid : string
 * 
 * Record Page Tags
 */
export const recordPageTags = async (pageUid: string) => {
    const res = await graphqlClient.mutation(pageQueries.recordPageTagsQuery, {
        pageUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
}

/**
 * @param 
 *     pageUid : string
 * 
 * Record Page impressions
 */
export const recordPageImpression = async (pageUid: string) => {
    const res = await graphqlClient.mutation(pageQueries.recordPageImpressionQuery, {
        pageUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
}

/**
 * @param 
 *     pageUid : string
 * 
 * Record Page likes
 */
export const recordPageLike = async (pageUid: string) => {
    const res = await graphqlClient.mutation(pageQueries.recordPageLikeQuery, {
        pageUid,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        throw res.error
    }

    dispatchPage({ type: 'setPage', data: { ...res.data.recordPageLike.page as Page } });
}

/**
 * @param 
 *     pageUid : string
 * 
 * Record Page dislikes
 */
export const recordPageDislike = async (pageUid: string) => {
    const res = await graphqlClient.mutation(pageQueries.recordPageDislikeQuery, {
        pageUid,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        throw res.error
    }

    dispatchPage({ type: 'setPage', data: { ...res.data.recordPageDislike.page as Page } });
}

/**
 * @param 
 *      siteUid : string
 *      totalVisits: number
 * 
 * loading more trending pages
 */
export const fetchMoreTrendingPages = async (
    siteUid: string,
    totalVisits: number
): Promise<Page[]> => {
    const res = await graphqlClient.query(pageQueries.fetchMoreTrendingPagesQuery, {
        siteUid,
        totalVisits
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchMoreTrendingPages.trendingPageFromSite as Page[];
}

/**
 * @param 
 *      siteUid : string
 *      fromIso: string
 * 
 * loading more new pages
 */
export const fetchMoreNewPages = async (
    siteUid: string,
    fromIso: string
): Promise<Page[]> => {
    const res = await graphqlClient.query(pageQueries.fetchMoreNewPagesQuery, {
        siteUid,
        fromIso
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchMoreNewPages.newPagesFromSite as Page[];
}

/**
 * @param 
 *      siteUid : string
 *      totalVisits: string
 * 
 * loading more popular pages
 */
export const fetchMorePopularPages = async (
    siteUid: string,
    totalVisits: number
): Promise<Page[]> => {
    const res = await graphqlClient.query(pageQueries.fetchMorePopularPagesQuery, {
        siteUid,
        totalVisits
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchMorePopularPages.popularPagesFromSite as Page[];
}

/**
 * @param 
 *      category?: string,
 *      itemNumber: number
 * 
 * discover popular pages by category
 */
export const discoverFetchPopularPages = async (
    itemNumber: number,
    category?: string
): Promise<{ pages: Page[], itemNumber: number }> => {
    const res = await graphqlClient.query(pageQueries.discoverFetchPopularPagesQuery, {
        itemNumber,
        category
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return {
        pages: res.data.discoverFetchPopularPages.pages as Page[],
        itemNumber: res.data.discoverFetchPopularPages.itemNumber as number
    }
}

/**
 * @param 
 *      category?: string,
 *      fromIso?: string
 * 
 * discover new pages by category
 */
export const discoverFetchNewPages = async (
    category?: string,
    fromIso?: string
): Promise<Page[]> => {
    const res = await graphqlClient.query(pageQueries.discoverFetchNewPagesQuery, {
        fromIso,
        category
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.discoverFetchNewPages.pages as Page[];
}


/**
 * @param 
 *      category?: string
 *      itemNumber: number
 * 
 * discover trending pages by category
 */
export const discoverFetchTrendingPages = async (
    itemNumber: number,
    category?: string
): Promise<{ pages: Page[], itemNumber: number }> => {
    const res = await graphqlClient.query(pageQueries.discoverFetchTrendingPagesQuery, {
        itemNumber,
        category
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return {
        pages: res.data.discoverFetchTrendingPages.pages as Page[],
        itemNumber: res.data.discoverFetchTrendingPages.itemNumber as number
    }
}

/**
 * @param 
 *      category?: string
 *      itemNumber: number,
 * 
 * discover new pages 
 */
export const discoverFetchHomePages = async (
    itemNumber: number,
    category?: string
): Promise<{ pages: Page[], itemNumber: number }> => {
    const res = await graphqlClient.query(pageQueries.discoverFetchHomePagesQuery, {
        itemNumber,
        category
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return {
        pages: res.data.discoverFetchHomePages.pages as Page[],
        itemNumber: res.data.discoverFetchHomePages.itemNumber as number
    }
}

/**
 * @param 
 *  siteUid:string
 * 
 *  subscribe to site
 */
export const subscribeToSite = async (siteUid: string): Promise<boolean> => {
    const res = await graphqlClient.mutation(pageQueries.subscribeToSiteQuery, {
        siteUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return false
    }

    return res.data.subscribeToSite === 'success'
}

/**
 * @param 
 *  siteUid:string
 * 
 *  unsubscribe to site
 */
export const unsubscribeToSite = async (siteUid: string): Promise<boolean> => {
    const res = await graphqlClient.mutation(pageQueries.unsubscribeToSiteQuery, {
        siteUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return false
    }

    return res.data.unsubscribeToSite === 'success'
}

/**
 * 
 * @param fromIso : string
 * @returns pages: any[]
 * 
 * return more pages
 */
export const fetchMyPages = async (
    fromIso: string,
    siteUid: string
): Promise<Page[] | undefined> => {
    const res = await graphqlClient.query(pageQueries.fetchSitePagesRecentUpdatesQuery, {
        fromIso,
        siteUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchSitePagesRecentUpdates.pages as Page[];
}

/**
 * 
 * @param data : <Page>
 * @returns page: <Page>
 * 
 * return create the new page
 */
export const createPage = async (props: {
    url: string,
    siteUid: string,
    title: string
}): Promise<Page | undefined> => {
    const res = await graphqlClient.mutation(pageQueries.createPageQuery, {
        url: props.url,
        siteUid: props.siteUid,
        title: props.title,
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.createPage.page as Page;
}

/**
 * 
 * @param pageToDeleteUid : string
 * @returns statue: boolean
 * 
 * return delete the page
 */
export const deletePage = async (pageToDeleteUid: string): Promise<boolean | undefined> => {
    const res = await graphqlClient.mutation(pageQueries.deletePageQuery, {
        pageToDeleteUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.deletePage === 'success'
}
