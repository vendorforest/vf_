import Express from "express";

import { constants } from "@Config/index";
import { isAuthenticated } from "@Utils/middleware";

const router = Express.Router();

function routeFor(type) {
  return (req, res, next) => {
    if (req.user.accountType === type) {
      return next();
    } else {
      return res.redirect(301, `/${constants.ACCOUNTTYPES[req.user.accountType]}/findjob`);
    }
  };
}
router.get("/vendor", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/profile", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/registration", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/jobdetails", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/placebid", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/givefeedback", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/dispute", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/vendor/settings", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));
router.get("/", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.VENDOR));

export default router;
