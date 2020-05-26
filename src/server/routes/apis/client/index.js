import express from "express";
import expressValidation from "express-joi-validation";

import { isAuthenticatedForApi } from "@Utils/middleware";
import getClientCtl from "@Controllers/clientController";
import { updateBilling, updateNotifySettings } from "./validation";

const router = express.Router();
const clientCtrl = getClientCtl();
const validator = expressValidation.createValidator({ passError: true });

router.use(isAuthenticatedForApi);

router.get("/get", clientCtrl.get);

router.post("/getsetupintent", clientCtrl.getSetupIntent);

router.get("/get_billing", clientCtrl.getBilling);

router.post("/update_billing", validator.body(updateBilling.body), clientCtrl.updateBilling);

router.post( "/notification", validator.body(updateNotifySettings.body), clientCtrl.updateNotifySettings );

router.post("/getnotifications", clientCtrl.getNotifications);

router.post("/get_deleted_notifications", clientCtrl.getDeletedNotifications);

router.post("/del_notification", clientCtrl.delNotification);

export default router;