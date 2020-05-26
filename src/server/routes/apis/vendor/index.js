// @ts-nocheck
import express from "express";
import expressValidation from "express-joi-validation";
import getVendorCtr from "@Controllers/vendorController";
import { isAuthenticatedForApi } from "@Utils/middleware";
import { 
    find, searchVendorInRadius, getBilling,
    update, updateCompany, updateBilling, updateNotifySettings 
} from "./validation";


const router = express.Router();

const vendorCtr = getVendorCtr();

const validator = expressValidation.createValidator({ passError: true });

router.get("/get", isAuthenticatedForApi, vendorCtr.get);

router.get("/get_billing", isAuthenticatedForApi, validator.query(getBilling.query), vendorCtr.getBilling);

router.get("/:username", validator.query(find.query), vendorCtr.findVendorByUserName);

router.use(isAuthenticatedForApi);

router.post("/find", validator.body(find.query), vendorCtr.find);

router.post("/update", validator.body(update.body), vendorCtr.update);

router.post( "/notification", validator.body(updateNotifySettings.body), vendorCtr.updateNotifySettings );

router.post("/update_company", validator.body(updateCompany.body), vendorCtr.updateCompany);

router.post("/update_billing", validator.body(updateBilling.body), vendorCtr.updateBilling);

router.post( "/search_inradius", validator.body(searchVendorInRadius.body), vendorCtr.searchVendorInRadius );

router.post("/find_vendors", vendorCtr.findVendors);

router.post("/get_new_question", vendorCtr.getNewQuestions);

router.post("/get_answered_question", vendorCtr.getAnsweredQuestions);

router.post("/insert_answer", vendorCtr.insertAnswer);

export default router;
