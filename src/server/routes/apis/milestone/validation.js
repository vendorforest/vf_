import Joi from "@hapi/joi";
import getEnv, { constants } from "@Config/index";

export const create = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    contract: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    status: Joi.number(),
    password: Joi.string(),
    endDateTime: Joi.string(),
    budget: Joi.number(),
  }),
};

export const update = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    description: Joi.string(),
    price: Joi.number(),
    status: Joi.number(),
  }),
};

export const release = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const reqRelease = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const cancel = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const get = {
  query: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const getMilestones = {
  query: Joi.object({
    status: Joi.number(),
    contract: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
  }),
};
