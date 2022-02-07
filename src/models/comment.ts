import Joi from "joi";
import { TextProp } from "./content-section";
import { UserLight } from "./user-light";

export interface Comment {
    uid: string,
    author: UserLight, // userlight
    parent: string, // parent commentUid
    pageUid: string, // page uid
    content: TextProp,
    createdIso: string,
    lastUpdateIso: string,
    likes: number,
    dislikes: number,
    isDeleted: boolean,
    isBanned: boolean,
    isFlagged: boolean,
    numberOfReports: number,
    count: number,
    userLiked?: -1 | 0 | 1
}

export const contentSchema = Joi.string().required().min(1)
