import { MediaLink, mediaLinkSchema } from './media-link';
import * as Joi from 'joi';
export interface Site {
    uid: string;
    name: string;
    siteIcon: MediaLink;
    /**
     * What is the site about;
     */
    description: string;
    /*
    The url the user wants for the site under our domain.
    The url is alpha-numeric with hypthens only '-'
    */
    url: string;
    totalImpressions: number;
    totalVisits: number;
    /**
     * The total ad earnings in USD.
     */
    totalEarnings: number;
    /**
     * When a site was last updated.
     */
    lastSiteUpdatedIso: string;
    /**
     * The users who control the site an it's pages.
     */
    createdIso: string;
    isDeleted: boolean;
    isBanned: boolean;
    siteOwnersUids: string[],
    theme: string,
    siteColor: string
}

export const siteNameSchema = Joi.string().required().min(2).max(70);
export const descriptionSchema = Joi.string().allow('').max(512).optional();
export const urlSchema = Joi.string().regex(/^[a-z0-9-]+$/).required();
export const siteColorSchema = Joi.string().regex(/^#[a-z0-9A-Z]+$/).optional();
export const siteIconSchema = mediaLinkSchema.required();
