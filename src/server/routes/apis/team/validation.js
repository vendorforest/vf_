import Joi from "joi";
import { constants } from "@Config/index";

export const get = {
  query: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const getTeams = {
  query: Joi.object({}),
};

export const create = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    name: Joi.string().required(),
    about: Joi.string().required(),
    admin: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    members: Joi.array().items(
      Joi.string()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .length(24)
        .required(),
    ),
  }),
};

export const update = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    name: Joi.string().required(),
    about: Joi.string().required(),
    members: Joi.array().items(
      Joi.string()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .length(24)
        .required(),
    ),
  }),
};

export const inviteUsers = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    invitedUsers: Joi.array().items(
      Joi.string()
        .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
        .length(24)
        .required(),
    ),
  }),
};

export const inviteAccept = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    invitedUser: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const inviteDecline = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    invitedUser: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const memberDecline = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.VENDOR]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    memberId: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};
