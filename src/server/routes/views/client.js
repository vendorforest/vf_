import Express from "express";
import { isAuthenticated } from "@Utils/middleware";
import { constants } from "@Config/index";

const router = Express.Router();

//ONLY
//constants.ACCOUNT_TYPE.CLIENT
function routeFor(type) {
  return (req, res, next) => {
    if (req.user.accountType === type) {
      return next();
    } else {
      return res.redirect(302, `/${constants.ACCOUNTTYPES[req.user.accountType]}`);
    }
  };
}
router.get("/settings", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/postjob", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/contractdetails", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/jobdetails", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/allcontracts", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/findvendors", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));
router.get("/", isAuthenticated, routeFor(constants.ACCOUNT_TYPE.CLIENT));

//   return router;
// }
export default router;
