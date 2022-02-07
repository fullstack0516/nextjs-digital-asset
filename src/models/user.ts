import { MediaLink } from './media-link';
import * as Joi from 'joi';

export interface User {
    uid: string,
    username: string,
    /**
     * Email is provided as a backup.
     */
    bio?: string;
    email?: string,
    createdIso: string,
    profileMedia: MediaLink,
    lastOpenedAppIso: string,
    isBanned: boolean,
    isDeleted: boolean,
    isFlagged: boolean;
    isAdmin: boolean,
    phoneNumber: string;
    /**
     * The user who reported this user + why.
     */
    reports: { [userUid: string]: string },
    /**
     * Their total visits across sites.
     */
    totalVisitsOnSites: number;
    /**
     * Their total impressions across sites.
     */
    totalImpressionsOnSites: number;
}

export const bioMaxLength = 512

export const usernameSchema = Joi.string().min(2).max(17).required()
export const emailSchema = Joi.string().email({ tlds: { allow: false } }).optional()
export const bioSchema = Joi.string().max(bioMaxLength).optional()
export const phoneNumberSchema = Joi.string().min(3).required();
