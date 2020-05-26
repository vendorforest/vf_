import express from "express";

import { isAuthenticated } from "@Utils/middleware";
import getEnv, { constants } from "@Config/index";

export default function(app, passport) {
  const router = express.Router();

  function routeFor(type) {
    return (req, res, next) => {
      if (constants.ACCOUNT_TYPE.CLIENT === req.user.accountType) {
        return next();
      } else {
        return res.redirect(302, `/${constants.ACCOUNTTYPES[req.user.accountType]}`);
      }
    };
  }
  // router.get('/settings', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  // router.get('/postjob', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  // router.get('/contractdetails', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  // router.get('/jobdetails', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  // router.get('/allcontracts', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  // router.get('/findvendors', isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
  router.get("/", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));

  return router;
}
