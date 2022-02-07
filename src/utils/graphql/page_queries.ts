import { gql } from "urql"
import { siteFields } from "./site_queries"

const dataTagFields = `{
    tagString
    uid
    tagCreatedIso
    tagScore
    contentCategories
    count
}`

const userMetaTagFields = `{
    tagString
    uid
    tagCreatedIso
}`

export const pageLikeFields = `{
    uid
    userUid
    pageUid
    createdIso
    liked
}`

export const contentSectionQuery = `{
    uid
    type
    content {
      ... on ContentHeader {
        uid
        text {
          html
          markdown
        }
      }
      ... on ContentTextBlock {
        uid
        text {
          markdown
          html
        }
      }
      ... on ContentTextImageRight {
        uid
        text {
          markdown
          html
        }
        image {
          url
          type
        }
      }
      ... on ContentTextImageLeft {
        uid
        text {
          html
          markdown
        }
        image {
          type
          url
        }
      }
      ... on ContentImageRow {
        uid
        image {
          type
          url
        }
      }
      ... on ContentVideoBlock {
        uid
        video {
          type
          url
        }
        text {
          html
          markdown
        }
        title
        processing
      }
      ... on ContentTripleImageCol {
        uid
        images {
          type
          url
        }
      }
    }
}`

export const pageFields = `{
    uid
    title
    description
    siteUid
    url
    totalImpressions
    totalVisits
    totalEarnings
    lastUpdateIso
    lastPublishIso
    createdIso
    dataTags ${dataTagFields}
    userMetaTags ${userMetaTagFields}
    contentCategories
    isDeleted
    isBanned
    isPublished
    isFlagged
    numberOfReports
    pageColor
    likes
    dislikes
    pageOwner
    contentSections ${contentSectionQuery}
    contentDraftSections ${contentSectionQuery}
}`

export const discoverFetchHomePagesQuery = gql`query DiscoverFetchHomePages($itemNumber: Float!, $category: String) {
    discoverFetchHomePages(itemNumber: $itemNumber, category: $category) {
      itemNumber
      pages ${pageFields}
    }
}`

export const discoverFetchNewPagesQuery = gql`query DiscoverFetchNewPages($fromIso: String, $category: String) {
    discoverFetchNewPages(fromIso: $fromIso, category: $category) {
      pages ${pageFields}
    }
}`

export const discoverFetchPopularPagesQuery = gql`query DiscoverFetchPopularPages($itemNumber: Float!, $category: String) {
    discoverFetchPopularPages(itemNumber: $itemNumber, category: $category) {
      itemNumber
      pages ${pageFields}
    }
}`

export const discoverFetchTrendingPagesQuery = gql`query DiscoverFetchTrendingPages($itemNumber: Float!, $category: String) {
    discoverFetchTrendingPages(itemNumber: $itemNumber, category: $category) {
      itemNumber
      pages ${pageFields}
    }
}`

export const fetchSitePagesRecentUpdatesQuery = gql`query FetchSitePagesRecentUpdates($fromIso: String!, $siteUid: String!) {
    fetchSitePagesRecentUpdates(fromIso: $fromIso, siteUid: $siteUid) {
      pages ${pageFields}
    }
}`

export const fetchPageViaUrlQuery = gql`query FetchPageViaUrl($url: String!) {
    fetchPageViaUrl(url: $url) {
      page ${pageFields}
      newPagesFromSite ${pageFields}
      popularPagesFromSite ${pageFields}
      trendingPageFromSite ${pageFields}
    }
}`

export const fetchSiteViaUrlPublicQuery = gql`query FetchSiteViaUrlPublic($siteUrl: String!) {
    fetchSiteViaUrlPublic(siteUrl: $siteUrl) {
      site ${siteFields}
      newPagesFromSite ${pageFields}
      popularPagesFromSite ${pageFields}
      trendingPageFromSite ${pageFields}
    }
}`

export const fetchPageViaUrlPublicQuery = gql`query FetchPageViaUrlPublic($url: String!) {
    fetchPageViaUrlPublic(url: $url) {
        page ${pageFields}
        newPagesFromSite ${pageFields}
        popularPagesFromSite ${pageFields}
        trendingPageFromSite ${pageFields}
    }
}`

export const fetchMoreTrendingPagesQuery = gql`query FetchMoreTrendingPages($siteUid: String!, $totalVisits: Float) {
    fetchMoreTrendingPages(siteUid: $siteUid, totalVisits: $totalVisits) {
      trendingPageFromSite ${pageFields}
    }
}`

export const fetchMoreNewPagesQuery = gql`query FetchMoreNewPages($siteUid: String!, $fromIso: String) {
    fetchMoreNewPages(siteUid: $siteUid, fromIso: $fromIso) {
      newPagesFromSite ${pageFields}
    }
}`

export const fetchMorePopularPagesQuery = gql`query FetchMorePopularPages($siteUid: String!, $totalVisits: Float) {
    fetchMorePopularPages(siteUid: $siteUid, totalVisits: $totalVisits) {
      popularPagesFromSite ${pageFields}
    }
}`

export const subscribeToSiteQuery = gql`mutation SubscribeToSite($siteUid: String!) {
    subscribeToSite(siteUid: $siteUid)
}`

export const unsubscribeToSiteQuery = gql`mutation UnsubscribeToSite($siteUid: String!) {
    unsubscribeToSite(siteUid: $siteUid)
}`

export const pageSectionAddQuery = gql`mutation PageSectionAdd($contentSectionType: String!, $pageUid: String!, $index: Float) {
    pageSectionAdd(contentSectionType: $contentSectionType, pageUid: $pageUid, index: $index) {
      page ${pageFields}
      contentSection ${contentSectionQuery}
    }
}`

export const pageSectionUpdateQuery = gql`mutation PageSectionUpdate($contentSectionUid: String!, $pageUid: String!, $nthImage: Float, $deleteVideoUrl: Boolean, $deleteImage: Boolean, $newVideoUrl: String, $newImageUrl: String, $newText: String, $newTitle: String, $processing: Boolean) {
    pageSectionUpdate(contentSectionUid: $contentSectionUid, pageUid: $pageUid, nthImage: $nthImage, deleteVideoUrl: $deleteVideoUrl, deleteImage: $deleteImage, newVideoUrl: $newVideoUrl, newImageUrl: $newImageUrl, newText: $newText, newTitle: $newTitle, processing: $processing) {
      page ${pageFields}
      updatedSection ${contentSectionQuery}
    }
}`

export const recordPageVisitQuery = gql`mutation RecordPageVisit($pageUid: String!) {
      recordPageVisit(pageUid: $pageUid)
}`

export const recordPageTagsQuery = gql`mutation RecordPageTags($pageUid: String!) {
      recordPageTags(pageUid: $pageUid) {
        result
      }
}`

export const pageSectionDeleteQuery = gql`mutation PageSectionDelete($contentSectionUid: String!, $pageUid: String!) {
    pageSectionDelete(contentSectionUid: $contentSectionUid, pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const pageSectionPublishQuery = gql`mutation PageSectionPublish($pageUid: String!) {
    pageSectionPublish(pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const pageSectionReorderQuery = gql`mutation PageSectionsReorder($toIndex: Float!, $fromIndex: Float!, $pageUid: String!) {
    pageSectionsReorder(toIndex: $toIndex, fromIndex: $fromIndex, pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const updatePageQuery = gql`mutation UpdatePage($pageToUpdateUid: String!, $isPublished: Boolean, $pageColor: String, $title: String) {
    updatePage(pageToUpdateUid: $pageToUpdateUid, isPublished: $isPublished, pageColor: $pageColor, title: $title) {
      page ${pageFields}
    }
}`

export const addMetaTagQuery = gql`mutation AddMetaTag($newTagString: String!, $pageUid: String!) {
    addMetaTag(newTagString: $newTagString, pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const removeMetaTagQuery = gql`mutation RemoveMetaTag($metaTagUid: String!, $pageUid: String!) {
    removeMetaTag(metaTagUid: $metaTagUid, pageUid: $pageUid) {
      page ${pageFields}
    }
  }`

export const reportPageQuery = gql`mutation ReportPage($reasonDesc: String!, $pageUid: String!) {
    reportPage(reasonDesc: $reasonDesc, pageUid: $pageUid)
}`

export const recordPageImpressionQuery = gql`mutation RecordPageImpression($pageUid: String!) {
    recordPageImpression(pageUid: $pageUid)
}`

export const recordPageLikeQuery = gql`mutation RecordPageLike($pageUid: String!) {
    recordPageLike(pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const recordPageDislikeQuery = gql`mutation RecordPageDislike($pageUid: String!) {
    recordPageDislike(pageUid: $pageUid) {
      page ${pageFields}
    }
}`

export const createPageQuery = gql`mutation Mutation($url: String!, $siteUid: String!, $title: String!) {
    createPage(url: $url, siteUid: $siteUid, title: $title) {
      page ${pageFields}
    }
}`

export const deletePageQuery = gql`mutation DeletePage($pageToDeleteUid: String!) {
    deletePage(pageToDeleteUid: $pageToDeleteUid)
}`

export const fetchPageLikeQuery = gql`query FetchPageLike($pageUid: String!) {
    fetchPageLike(pageUid: $pageUid) {
      pageLike ${pageLikeFields}
    }
}`
