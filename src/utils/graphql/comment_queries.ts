import { gql } from "urql";
import { userLightFields } from './user_queries'

const commentFields = `{
    uid
    pageUid
    author ${userLightFields}
    content {
      markdown
      html
    }
    lastUpdateIso
    createdIso
    isDeleted
    isBanned
    isFlagged
    numberOfReports
    count
    parent
    likes
    dislikes,
    userLiked
}`

export const fetchCommentsQuery = gql`query FetchComments($pageUid: String!, $parentUid: String, $fromIso: String) {
    fetchComments(pageUid: $pageUid, parentUid: $parentUid, fromIso: $fromIso) 
        ${commentFields}
}`

export const likeCommentQuery = gql`mutation Mutation($commentUid: String!) {
    likeComment(commentUid: $commentUid) 
    ${commentFields}
}`

export const disLikeCommentQuery = gql`mutation DisLikeComment($commentUid: String!) {
    disLikeComment(commentUid: $commentUid) 
    ${commentFields}
}`

export const createCommentQuery = gql`mutation CreateComment($content: String!, $pageUid: String!, $parentUid: String) {
    createComment(parentUid: $parentUid, content: $content, pageUid: $pageUid) 
    ${commentFields}
}`

export const deleteCommentQuery = gql`mutation DeleteComment($commentUid: String!) {
    deleteComment(commentUid: $commentUid) 
    ${commentFields}
}`

export const fetchCountOfCommentsQuery = gql`query Query($pageUid: String!) {
    fetchCountOfComments(pageUid: $pageUid)
}`
