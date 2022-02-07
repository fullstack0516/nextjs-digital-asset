import { gql } from "urql"

export const userFields = `{
    uid
    username
    bio
    email
    profileMedia {
      type
      url
    }
    lastOpenedAppIso
    createdIso
    isBanned
    isDeleted
    isFlagged
    phoneNumber
    totalVisitsOnSites
    totalImpressionsOnSites
    isAdmin
}`

export const userLightFields = `{
    uid
    username
    profileMedia {
      url
      type
    }
}`

export const userDataTag = `{
    uid
    tagString
    tagCreatedIso
    tagScore
    contentCategories
    count
    userUid
    tagRecordedForUserIso
    companyId
}`

export const checkValidTokenQuery = gql`query Query($jwt: String!) {
    checkValidToken(jwt: $jwt)
}`

export const WebsiteStatusQuery = gql`query WebsiteStatus {
    fetchWebsiteStatus {
        websiteStatus {
            uid
            mode
            isUnderMaintenance
            maintenanceMessageForUsers
        }
    }
}`

export const fetchUserQuery = gql`query User {
    fetchUser {
      user ${userFields}
    }
}`

export const fetchMyDataQuery = gql`query FetchMyData($fromIso: String!, $category: String) {
  fetchMyData(fromIso: $fromIso, category: $category) {
    myData 
    count
  }
}`

export const fetchUserLightQuery = gql`query FetchUserLight($userLightUid: String!) {
    fetchUserLight(userLightUid: $userLightUid) {
      userLight ${userLightFields}
    }
}`

export const checkSiteSubscribedQuery = gql`query CheckSubscribedSite($siteUid: String!) {
    checkSubscribedSite(siteUid: $siteUid) {
      isSubscribed
    }
}`

export const fetchDataPointsCountQuery = gql`query FetchDataPointsCount {
    fetchDataPointsCount {
      count
    }
}`

export const getBlacklistedCategoriesQuery = gql`query BlacklistedCategories {
    getBlacklistedCategories {
      blacklistedCategories {
        userUid
        category
      }
    }
}`

export const setCategoryBlacklistedQuery = gql`mutation Mutation($categoryName: String!) {
    setCategoryBlacklisted(categoryName: $categoryName)
}`

export const setCategoryUnblacklistedQuery = gql`mutation SetCategoryUnblacklisted($categoryName: String!) {
    setCategoryUnblacklisted(categoryName: $categoryName)
}`

export const sendSmsCodeQuery = gql`mutation SendSmsCode($phoneNumber: String!) {
    sendSmsCode(phoneNumber: $phoneNumber) {
      verificationCode
      userExists
    }
}`

export const resendSmsCodeQuery = gql`mutation ResendSmsCode($phoneNumber: String!, $verificationId: String!) {
    resendSmsCode(phoneNumber: $phoneNumber, verificationId: $verificationId)
}`

export const confirmSMSCodeQuery = gql`mutation ConfirmSMSCode($phoneNumber: String!, $verificationId: String!, $smsCode: String!, $username: String) {
    confirmSMSCode(phoneNumber: $phoneNumber, verificationId: $verificationId, smsCode: $smsCode, username: $username) {
      user ${userFields}
      jwt
    }
}`

export const updateUserQuery = gql`mutation UpdateUser($origin: String!, $lastOpenedAppIso: String, $profileMedia: MediaLinkInputType, $phoneNumber: String, $bio: String, $email: String, $username: String) {
  updateUser(origin: $origin, lastOpenedAppIso: $lastOpenedAppIso, profileMedia: $profileMedia, phoneNumber: $phoneNumber, bio: $bio, email: $email, username: $username) {
    user ${userFields}
  }
}`

export const confirmChangeSMSQuery = gql`mutation ConfirmChangeSMS($verificationId: String!, $smsCode: String!, $phoneNumber: String!) {
  confirmChangeSMS(verificationId: $verificationId, smsCode: $smsCode,  phoneNumber: $phoneNumber) {
    SMSVerified
  }
}`

export const confirmBackupEmailQuery = gql`mutation ConfirmBackupEmail($code: String!) {
  confirmBackupEmail(code: $code) {
    user ${userFields}
  }
}`

export const deleteSelfQuery = gql`mutation DeleteSelf {
  deleteSelf {
    user ${userFields}
  }
}`

export const checkUsernameExistQuery = gql`query Query($username: String!) {
    checkUsernameExist(username: $username)
}`

export const fetchUsersCoinAmountQuery = gql`query Query {
    fetchUsersCoinAmount
}`
