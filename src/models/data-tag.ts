import * as Joi from "joi";

export interface DataTag {
    uid: string;
    tagString: string;
    tagCreatedIso: string;
    tagScore: number;
    contentCategories: string;
    count: number;
}

export const dataTagSchema = Joi.object({
    _id: Joi.any(),
    uid: Joi.string().required(),
    tagString: Joi.string().min(1).required(),
    tagCreatedIso: Joi.string().isoDate().required(),
    contentCategories: Joi.string().isoDate().required(),
    tagScore: Joi.number().required(),
    count: Joi.number().required()
})
