import Joi from "joi";
import getEnv, { constants } from "@Config/index";

export const update = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    proposal: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    team: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    sender: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    receiver: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    offerBudgetType: Joi.number().required(),
    budget: Joi.number().required(),
    status: Joi.number().required(),
  }),
};

export const getOffers = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  query: Joi.object({
    proposal: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    team: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    receiver: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    status: Joi.number(),
  }),
};

export const decline = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const accept = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    message: Joi.string().required(),
  }),
};
