import express from "express";
import expressValidation from "express-joi-validation";

import getServiceCtr from "@Controllers/serviceController";
import { create, update } from "./validation";
// const { isAuthenticatedForApi } = require("@Utils/middleware");

const router = express.Router();
const serviceCtr = getServiceCtr();
const validator = expressValidation.createValidator({ passError: true });

// export default function(app, passport) {
router.get("/get_services", serviceCtr.getServices);
// router.use(isAuthenticatedForApi)
router.post("/create", validator.body(create.body), serviceCtr.create);
router.post("/update", validator.body(update.body), serviceCtr.updateCategory);

//   return router;
// }

export default router;
