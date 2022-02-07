import * as Joi from "joi";

export interface WebsiteStatus {
    userUid: string;
    mode: 'online' | 'offline';
    isUnderMaintenance: boolean;
    maintenanceMessageForUsers: string
}

export const websiteStatusSchema = Joi.object({
    userUid: Joi.string().required(),
    category: Joi.string().required(),
    isUnderMaintenance: Joi.bool().required(),
    maintenanceMessageForUsers: Joi.string().required()
})
