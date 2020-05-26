// @ts-nocheck
import express from "express";
import expressValidation from "express-joi-validation";

import getJobCtr from "@Controllers/jobController";
import { isAuthenticatedForApi } from "@Utils/middleware";
import { find, create, update, getClientJobs, get } from "./validation";

const jobCtr = getJobCtr();
const router = express.Router();
const validator = expressValidation.createValidator({ passError: true });

router.use(isAuthenticatedForApi);
router.post("/find", validator.fields(find.user), validator.body(find.body), jobCtr.find);
router.post("/create", validator.body(create.body), jobCtr.create);
router.post("/update", validator.body(update.body), jobCtr.update);
router.post("/get_client_jobs", validator.body(getClientJobs.body), jobCtr.getClientJobs);
router.get("/get", validator.query(get.query), jobCtr.get);
router.post("/send_email", jobCtr.sendEmail);
router.post("/sendNewJobNotification", jobCtr.sendingNotification);
router.post("/initChat", jobCtr.initChat);
router.post("/job_completed", jobCtr.jobCompleted);
router.get("/get_my_job", jobCtr.getMyPosts);
router.post("/hire_vendor", jobCtr.hireVendor);
router.post("/ask_question", jobCtr.askQuestion);

export default router;
