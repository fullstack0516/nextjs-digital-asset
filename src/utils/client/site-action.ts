import { MediaLink } from "../../models/media-link";
import { Site } from "../../models/site";
import * as siteQueries from "../graphql/site_queries";
import { graphqlClient, graphqlErrorHandler } from "./graphql-client";

/**
 * @param 
 *  siteUid:string
 * 
 *  fetch the site
 */
export const fetchSite = async (siteUid: string): Promise<Site> => {
    const res = await graphqlClient.query(siteQueries.fetchSiteQuery, {
        siteUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchSite.site as Site;
}

/**
 * @param 
 * totalVisits?:number
 * 
 * discover popular sites
 */
export const discoverFetchPopularSites = async (totalVisits?: number): Promise<Site[]> => {
    const res = await graphqlClient.query(siteQueries.discoverFetchPopularSitesQuery, {
        totalVisits
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.discoverFetchPopularSites.sites as Site[];
}

/**
 * 
 * @param data : <Site>
 * @returns site: <Site>
 * 
 * return create the new site
 */

export const createSite = async (props: {
    url: string,
    siteIcon: MediaLink,
    name: string,
    siteColor?: string,
    description?: string
}): Promise<Site | undefined> => {
    const res = await graphqlClient.mutation(siteQueries.createSiteQuery, {
        url: props.url,
        siteIcon: props.siteIcon,
        name: props.name,
        siteColor: props.siteColor,
        description: props.description,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.createSite.site as Site;
}

/**
 * 
 * @param fromIso : string
 * @returns sites: any[]
 * 
 * return more sites
 */
export const fetchMySites = async (
    fromIso: string
): Promise<Site[] | undefined> => {
    const res = await graphqlClient.query(siteQueries.fetchMySitesQuery, {
        fromIso
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.fetchMySites.sites as Site[];
}

/**
 * 
 * @param 
 *     siteToUpdateUid: string
 *     name?: string,
 *     siteIcon?: <MediaLink>,
 *     description?: string
 * @returns site: <Site>
 * 
 * return update the site
 */

export const updateSite = async (props: {
    siteToUpdateUid: string,
    name?: string,
    siteIcon?: MediaLink,
    description?: string
}): Promise<Site | undefined> => {
    const res = await graphqlClient.mutation(siteQueries.updateSiteQuery, {
        siteToUpdateUid: props.siteToUpdateUid,
        name: props.name,
        siteIcon: props.siteIcon,
        description: props.description,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }
    return res.data.updateSite.site as Site;
}

/**
 * 
 * @param siteToDeleteUid : string
 * @returns statue: boolean
 * 
 * return delete the site
 */

export const deleteSite = async (
    siteToDeleteUid: string
): Promise<boolean | undefined> => {
    const res = await graphqlClient.mutation(siteQueries.deleteSiteQuery, {
        siteToDeleteUid
    }).toPromise()
    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.deleteSite === "success"
}
