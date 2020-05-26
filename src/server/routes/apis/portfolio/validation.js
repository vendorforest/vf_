import Joi from "joi";

export const get = {
  query: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const getPortfolios = {
  query: Joi.object({
    user: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const getMyPortfolios = {
  query: Joi.object({}),
};

export const create = {
  body: Joi.object({
    attachImgFiles: Joi.array().items({
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    }),
    attachVidFiles: Joi.array().items({
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    }),
    coverImage: {
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    },
    caption: Joi.string().required(),
    embedvideo: Joi.string(),
    title: Joi.string().required(),
  }),
};

export const update = {
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    attachImgFiles: Joi.array().items({
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    }),
    attachVidFiles: Joi.array().items({
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    }),
    coverImage: {
      name: Joi.string(),
      uid: Joi.string(),
      status: Joi.string(),
      url: Joi.string(),
    },
    caption: Joi.string(),
    embedvideo: Joi.string(),
    title: Joi.string(),
  }),
};

export const upload_video = {
  body: Joi.object({
    url: Joi.string().uri().required()
  }),
};

export const delete_portfolio = {
  body: Joi.object({
    _id: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24).required(),
  }),
};
