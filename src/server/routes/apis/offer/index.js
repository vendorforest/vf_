import express from "express";
import expressValidation from "express-joi-validation";

import getOfferCtl from "@Controllers/offerController";
import { isAuthenticatedForApi } from "@Utils/middleware";

import { update, getOffers, decline, accept } from "./validation";

const router = express.Router();
const offerCtr = getOfferCtl();
const validator = expressValidation.createValidator({ passError: true });

router.use(isAuthenticatedForApi);
router.post("/update", validator.body(update.body), offerCtr.update);
router.get("/get_offers", validator.query(getOffers.query), offerCtr.getOffers);
router.post("/decline", validator.body(decline.body), offerCtr.decline);
router.post("/accept", validator.body(accept.body), offerCtr.accept);
router.post("/pending_offers", offerCtr.pendingOffers);

export default router;
