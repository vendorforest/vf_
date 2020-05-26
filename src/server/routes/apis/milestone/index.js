import express from "express";
import expressValidation from "express-joi-validation";
import getMilestoneCtr from "@Controllers/milestoneController";

import { isAuthenticatedForApi } from "@Utils/middleware";
import { cancel, create, get, getMilestones, release, reqRelease, update } from "./validation";

const router = express.Router();
const validator = expressValidation.createValidator({
  passError: true,
});
const milestoneCtr = getMilestoneCtr();

router.use(isAuthenticatedForApi);
router.post("/create", validator.body(create.body), milestoneCtr.create);
router.post("/update", validator.body(update.body), milestoneCtr.update);
router.post("/release", validator.body(release.body), milestoneCtr.release);
router.post("/req_release", validator.body(reqRelease.body), milestoneCtr.reqRelease);
router.post("/cancel", validator.body(cancel.body), milestoneCtr.cancel);
router.get("/get", validator.query(get.query), milestoneCtr.get);
router.get("/get_milestones", validator.query(getMilestones.query), milestoneCtr.getMilestones);
router.post("/milestone_result", milestoneCtr.milestoneResult);
export default router;
