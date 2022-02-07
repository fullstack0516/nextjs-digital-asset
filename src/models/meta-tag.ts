import * as Joi from "joi";

export interface MetaTag {
    uid: string;
    tagString: string;
    tagCreatedIso: string;
}

export const MetaTagSchema = Joi.object({
    _id: Joi.any(),
    uid: Joi.string().required(),
    tagString: Joi.string().min(1).required(),
    tagCreatedIso: Joi.string().isoDate().required(),
})
