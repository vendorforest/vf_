// @ts-nocheck
import express from "express";
import expressValidation from "express-joi-validation";
import getProposalCtr from "@Controllers/proposalController";

import { isAuthenticatedForApi } from "@Utils/middleware";
import { create, getProposales, _delete, get, update } from "./validation";

const router = express.Router();
const proposalCtr = getProposalCtr();
const validator = expressValidation.createValidator({
  passError: true,
});

router.use(isAuthenticatedForApi);
router.post("/create", validator.body(create.body), proposalCtr.create);
router.post("/update", validator.body(update.body), proposalCtr.update);
router.post("/delete", validator.body(_delete.body), proposalCtr.delete);
router.get("/get", validator.query(get.query), proposalCtr.get);
router.get("/get_proposales", validator.query(getProposales.query), proposalCtr.getProposales);
router.post("/accept_team_offer", proposalCtr.acceptTeamOffer);

export default router;
