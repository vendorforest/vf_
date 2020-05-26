// @ts-nocheck
import express from "express";
import expressValidation from "express-joi-validation";

import getHomeCtr from "@Controllers/homeController";
import { get } from "./validation";

const router = express.Router();
const homeCtr = getHomeCtr();
const validator = expressValidation.createValidator({ passError: true });

router.get("/", validator.query(get.query), homeCtr.get);

export default router;
