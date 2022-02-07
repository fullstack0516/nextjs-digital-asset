import { gql } from "urql"

export const siteFields = `{
    uid
    name
    siteIcon {
      url
      type
    }
    description
    url
    totalImpressions
    totalVisits
    totalEarnings
    lastSiteUpdatedIso
    createdIso
    isDeleted
    isBanned
    siteOwnersUids
    siteColor
}`

export const fetchSiteQuery = gql`query FetchSite($siteUid: String!) {
    fetchSite(siteUid: $siteUid) {
      site ${siteFields}
    }
}`

export const fetchSiteViaUrlQuery = gql`query FetchSiteViaUrl($siteUrl: String!) {
    fetchSiteViaUrl(siteUrl: $siteUrl) {
      site ${siteFields}
    }
}`

export const fetchSubscribedSitesQuery = gql`query Sites {
    fetchSubscribedSites {
      sites ${siteFields}
    }
}`

export const fetchMySitesQuery = gql`query FetchMySites($fromIso: String!) {
    fetchMySites(fromIso: $fromIso) {
      sites ${siteFields}
    }
}`

export const discoverFetchPopularSitesQuery = gql`query DiscoverFetchPopularSites($totalVisits: Float!) {
    discoverFetchPopularSites(totalVisits: $totalVisits) {
        sites ${siteFields}
    }
}`

export const createSiteQuery = gql`mutation CreateSite($url: String!, $siteIcon: MediaLinkInputType!, $name: String!, $siteColor: String, $description: String) {
    createSite(url: $url, siteIcon: $siteIcon, name: $name, siteColor: $siteColor, description: $description) {
      site ${siteFields}
    }
}`

export const updateSiteQuery = gql`mutation UpdateSite($siteToUpdateUid: String!, $description: String, $siteIcon: MediaLinkInputType, $name: String) {
    updateSite(siteToUpdateUid: $siteToUpdateUid, description: $description, siteIcon: $siteIcon, name: $name) {
        site ${siteFields}
    }
}`

export const deleteSiteQuery = gql`mutation DeleteSite($siteToDeleteUid: String!) {
    deleteSite(siteToDeleteUid: $siteToDeleteUid)
}`
