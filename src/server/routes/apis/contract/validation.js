import Joi from "joi";
import getEnv, { constants } from "@Config/index";

export const create = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    job: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    proposal: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    vendor: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    budget: Joi.number().required(),
    limitTime: Joi.number(),
    stDateTime: Joi.string().required(),
    endDateTime: Joi.string().required(),
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
    budget: Joi.number(),
    completedPercent: Joi.number(),
    isCompleted: Joi.boolean(),
  }),
};

export const end = {
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

export const getContracts = {
  query: Joi.object({
    status: Joi.number(),
    client: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    vendor: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
  }),
};
