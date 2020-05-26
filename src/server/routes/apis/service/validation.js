import Joi from "joi";

export const create = {
  body: Joi.object({
    name: Joi.string().required(),
    categories: Joi.array().items({
      name: Joi.string().required(),
      subCategories: Joi.array().items(Joi.string()),
    }),
  }),
};

export const update = {
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    name: Joi.string().required(),
    subCategories: Joi.array().items(Joi.string()),
  }),
};
