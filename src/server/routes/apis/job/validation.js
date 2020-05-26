import Joi from "joi";
import { constants } from "@Config/index";

export const find = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  body: Joi.object({
    service: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    category: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    client: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    budgetType: Joi.number(),
    location: {
      country: Joi.string(),
      city: Joi.string(),
    },
    vendorType: Joi.number(),
    title: Joi.string(),
    status: Joi.array()
      .items(Joi.number())
      .required(),
  }),
};

export const getClientJobs = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    status: Joi.array().items(Joi.number()),
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

export const create = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  body: Joi.object({
    status: Joi.number().required(),
    service: Joi.string().required(),
    category: Joi.string().required(),
    subCategories: Joi.array().items(Joi.string().required()),
    title: Joi.string().required(),
    description: Joi.string().required(),
    budgetType: Joi.number().required(),
    budget: Joi.number().required(),
    avbHrsPerWeek: Joi.number().required(),
    stDateTime: Joi.string().required(),
    endDateTime: Joi.string().required(),
    location: Joi.object()
      .keys({
        country: Joi.string(),
        state: Joi.string(),
        city: Joi.string(),
        fullAddress: Joi.string(),
        lat: Joi.number(),
        lng: Joi.number(),
        placeId: Joi.string(),
      })
      .required(),
    postRadius: Joi.number().required(),
    attachFiles: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        url: Joi.string(),
      }),
    ),
    questions: Joi.array().items(Joi.string()),
    visibility: Joi.number().required(),
    vendorType: Joi.number().required(),
    invitedVendors: Joi.array().items(Joi.string()),
    isUseClientLocation: Joi.boolean(),
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
    service: Joi.string(),
    category: Joi.string(),
    subCategories: Joi.array().items(Joi.string()),
    title: Joi.string(),
    description: Joi.string(),
    budgetType: Joi.number(),
    budget: Joi.number(),
    avbHrsPerWeek: Joi.number(),
    stDateTime: Joi.string(),
    endDateTime: Joi.string(),
    location: Joi.object().keys({
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
      fullAddress: Joi.string(),
      lat: Joi.number(),
      lng: Joi.number(),
      placeId: Joi.string(),
    }),
    postRadius: Joi.number(),
    attachFiles: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        url: Joi.string(),
      }),
    ),
    questions: Joi.array().items(Joi.string()),
    visibility: Joi.number(),
    vendorType: Joi.number(),
    invitedVendors: Joi.array().items(Joi.string()),
    isUseClientLocation: Joi.boolean(),
    status: Joi.number(),
  }),
};
