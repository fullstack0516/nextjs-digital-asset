import { Comment } from "../../models/comment";
import * as commentQuries from "../graphql/comment_queries";
import { graphqlClient, graphqlErrorHandler } from "./graphql-client";

/**
 * @param 
 *      pageUid: string
 *      parentUid?: string,
 *      fromIso?: string,
 * @returns 
 *      Comment[]
 * 
 * fetch new comments by parent comment uid & fromIso
 */
export const fetchComments = async (props: {
    pageUid: string,
    parentUid?: string,
    fromIso?: string
}): Promise<Comment[]> => {
    const { pageUid, parentUid, fromIso } = props

    const res = await graphqlClient.query(commentQuries.fetchCommentsQuery, {
        pageUid, parentUid, fromIso
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return []
    }

    return res.data.fetchComments
}

/**
 * @param 
 *     commentUid : string
 * 
 * Record Page likes
 */
export const recordCommentLike = async (commentUid: string): Promise<Comment> => {
    const res = await graphqlClient.mutation(commentQuries.likeCommentQuery, {
        commentUid,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.likeComment
}

/**
 * @param 
 *     commentUid : string
 * 
 * Record Page dislikes
 */
export const recordCommetDislike = async (commentUid: string): Promise<Comment> => {
    const res = await graphqlClient.mutation(commentQuries.disLikeCommentQuery, {
        commentUid,
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.disLikeComment
}

/**
 * @param 
 *      content : string
 *      pageUid: string
 *      parentUid?: string
 * 
 * create the new comment
 */
export const createComment = async (props: {
    content: string,
    pageUid: string
    parentUid?: string
}): Promise<Comment> => {
    const { content, pageUid, parentUid } = props

    const res = await graphqlClient.mutation(commentQuries.createCommentQuery, {
        content,
        pageUid,
        parentUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error, 'createComment')
        return null
    }

    return res.data.createComment
}

/**
 * @param 
 *      commentUid : string
 * 
 * delete the comment
 */
export const deleteComment = async (commentUid: string): Promise<Comment> => {

    const res = await graphqlClient.mutation(commentQuries.deleteCommentQuery, {
        commentUid
    }).toPromise()

    if (res.error) {
        graphqlErrorHandler(res.error)
        return null
    }

    return res.data.deleteComment
}
