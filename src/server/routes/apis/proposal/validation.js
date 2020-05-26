import Joi from "joi";
import getEnv, { constants } from "@Config/index";

export const create = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
    ]),
  }),
  body: Joi.object({
    job: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    vendor: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
    offerBudget: Joi.number().required(),
    offerBudgetType: Joi.number().required(),
    bidType: Joi.number().required(),
    offers: Joi.array().items({
      team: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24).required(),
      receiver: Joi.string().regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i).length(24).required(),
      offerBudgetType: Joi.number().required(),
      budget: Joi.number().required(),
    }),
    answers: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      }),
    ),
  }),
};

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
    offerBudget: Joi.number(),
    offerBudgetType: Joi.number(),
    bidType: Joi.number(),
    answers: Joi.array().items(
      Joi.object({
        question: Joi.string().required(),
        answer: Joi.string().required(),
      }),
    ),
  }),
};

export const _delete = {
  user: Joi.object({
    accountType: Joi.number().allow([
      constants.ACCOUNT_TYPE.VENDOR,
      constants.ACCOUNT_TYPE.PROVENDOR,
      constants.ACCOUNT_TYPE.CLIENT,
    ]),
  }),
  body: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const get = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  query: Joi.object({
    _id: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24)
      .required(),
  }),
};

export const getProposales = {
  user: Joi.object({
    accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
  }),
  query: Joi.object({
    job: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    vendor: Joi.string()
      .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
      .length(24),
    status: Joi.number(),
  }),
};

// export const create = {
//   user: {
//     accountType: Joi.number().allow([
//       constants.ACCOUNT_TYPE.VENDOR,
//       constants.ACCOUNT_TYPE.PROVENDOR,
//     ]),
//   },
//   body: {
//     job: Joi.string()
//       .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
//       .length(24)
//       .required(),
//     vendor: Joi.string()
//       .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
//       .length(24)
//       .required(),
//     offerBudget: Joi.number().required(),
//     offerBudgetType: Joi.number().required(),
//     bidType: Joi.number().required(),
//     offers: Joi.array().items(
//       Joi.object({
//         team: Joi.string()
//           .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
//           .length(24)
//           .required(),
//         receivers: Joi.array().items(
//           Joi.object({
//             member: Joi.string()
//               .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
//               .length(24)
//               .required(),
//             offerBudget: Joi.number().required(),
//           }),
//         ),
//       }),
//     ),
//     answers: Joi.array().items(
//       Joi.object({
//         question: Joi.string().required(),
//         answer: Joi.string().required(),
//       }),
//     ),
//   },
// };

// export const getProposales = {
//   user: {
//     accountType: Joi.number().allow([constants.ACCOUNT_TYPE.CLIENT]),
//   },
//   query: {
//     job: Joi.string()
//       .regex(/^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i)
//       .length(24)
//       .required(),
//   },
// };
