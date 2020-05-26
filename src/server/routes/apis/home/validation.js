import Joi from "joi";
import getEnv, { constants } from "@Config/index";
export const get = {
  query: Joi.object({}),
};
