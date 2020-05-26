import Joi from "@hapi/joi";

export const get = {
  query: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
  }),
};

export const getReviews = {
  query: Joi.object({
    to: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    from: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
  }),
};

export const getMyReviews = {
  query: Joi.object({}),
};

export const create = {
  body: Joi.object({
    contract: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    from: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    to: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    rate: Joi.number().required(),
    feedback: Joi.string().required(),
    endReason: Joi.number(),
    recommend: Joi.number(),
    vendorBadge: Joi.array().items(Joi.number()),
  }),
};

export const update = {
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    rate: Joi.number(),
    feedback: Joi.string(),
  }),
};
