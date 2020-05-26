import Joi from "joi";

export const login = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    remember: Joi.boolean(),
  }),
};

export const register = {
  body: Joi.object({
    username: Joi.string().required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string().required(),
    confirm: Joi.string(),
    accountType: Joi.number().required(),
    agreement: Joi.boolean(),
  }),
};

export const getUser = {
  query: Joi.object({}),
};

export const sendCodeEmail = {
  params: Joi.object({
    email: Joi.string()
      .email()
      .required(),
  }),
};

export const updateAccount = {
  body: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    username: Joi.string(),
    email: Joi.string().email(),
    verifyCode: Joi.string(),
    bsLocation: {
      country: Joi.string(),
      state: Joi.string(),
      city: Joi.string(),
      fullAddress: Joi.string(),
      lat: Joi.number(),
      lng: Joi.number(),
      placeId: Joi.string(),
    },
    phone: Joi.string(),
    phonePrefix: Joi.string(),
    localPhoneNumber: Joi.string(),
    timeZone: Joi.string(),
  }),
};

export const resetPass = {
  body: Joi.object({
    newPass: Joi.string().required(),
    oldPass: Joi.string().required(),
    repeatPass: Joi.string(),
  }),
};
