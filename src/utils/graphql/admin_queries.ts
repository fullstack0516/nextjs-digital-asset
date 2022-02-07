import { gql } from "urql"
import { pageFields } from "./page_queries"
import { siteFields } from "./site_queries"
import { userFields } from "./user_queries"
import { videoFields } from "./video_queries"

export const adminFetchNewUsersCountQuery = gql`query AdminFetchNewUsersCount($daysNAgo: Float!) {
    adminFetchNewUsersCount(daysNAgo: $daysNAgo) {
      count
      rate
    }
}`

export const adminFetchNewSitesCountQuery = gql`query AdminFetchNewSitesCount($daysNAgo: Float!) {
    adminFetchNewSitesCount(daysNAgo: $daysNAgo) {
      count
      rate
    }
}`

export const adminFetchUsersCountQuery = gql`query AdminFetchUsersCount {
      adminFetchUsersCount {
        count
      }
}`

export const adminFetchDataPointsCountQuery = gql`query AdminFetchDataPointsCount {
      adminFetchDataPointsCount {
        count
      }
}`

export const adminFetchNewPagesQuery = gql`query AdminFetchNewPages($showCount: Float!, $pageNum: Float!) {
      adminFetchNewPages(showCount: $showCount, pageNum: $pageNum) {
        totalCount
        pages ${pageFields}
      }
}`

export const adminFetchSitesQuery = gql`query AdminFetchSites($showCount: Float!, $pageNum: Float!) {
    adminFetchSites(showCount: $showCount, pageNum: $pageNum) {
      totalCount
      sites ${siteFields}
    }
}`

export const adminFetchUsersQuery = gql`query AdminFetchUsers($showCount: Float!, $pageNum: Float!) {
    adminFetchUsers(showCount: $showCount, pageNum: $pageNum) {
      totalCount
      users ${userFields}
    }
}`

export const adminFetchVideosQuery = gql`query AdminFetchVideos($showCount: Float!, $pageNum: Float!) {
  adminFetchVideos(showCount: $showCount, pageNum: $pageNum) {
    totalCount
    videos ${videoFields}
  }
}`

export const adminFetchVideoQuery = gql`query AdminFetchVideo($uid: String!) {
  adminFetchVideo(uid: $uid) {
    video ${videoFields}
  }
}`

export const adminUpdateVideoQuery = gql`mutation AdminUpdateVideo($uid: String!, $intelligenceStatus: String!) {
  adminUpdateVideo(uid: $uid, intelligenceStatus: $intelligenceStatus) {
    video ${videoFields}
  }
}`

export const adminFetchNewUsersQuery = gql`query AdminFetchNewUsers($fromIso: String!) {
    adminFetchNewUsers(fromIso: $fromIso) {
      users ${userFields}
    }
}`

export const adminUpdatePageQuery = gql`mutation AdminUpdatePage($pageToUpdateUid: String!, $isBanned: String) {
    adminUpdatePage(pageToUpdateUid: $pageToUpdateUid, isBanned: $isBanned) {
      page ${pageFields}
    }
}`
