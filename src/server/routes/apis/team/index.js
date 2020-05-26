import express from "express";
import expressValidation from "express-joi-validation";

import getTeamCtr from "@Controllers/teamController";
import { isAuthenticatedForApi } from "@Utils/middleware";
import {
  get,
  create,
  inviteAccept,
  inviteDecline,
  inviteUsers,
  update,
  getTeams,
  memberDecline,
} from "./validation";

const router = express.Router();
const teamCtr = getTeamCtr();
const validator = expressValidation.createValidator({ passError: true });

// export default function(app, passport) {
router.use(isAuthenticatedForApi);
router.get("/get", validator.query(get.query), teamCtr.get);
router.get("/get_teams", validator.query(getTeams.query), teamCtr.getTeams);
router.post("/create", validator.body(create.body), teamCtr.create);
router.post("/update", validator.body(update.body), teamCtr.update);
router.post("/invite_users", validator.body(inviteUsers.body), teamCtr.inviteUsers);
router.post("/invite_accept", validator.body(inviteAccept.body), teamCtr.inviteAccept);
router.post("/invite_decline", validator.body(inviteDecline.body), teamCtr.inviteDecline);
router.post("/member_decline", validator.body(memberDecline.body), teamCtr.memberDecline);
router.post("/pending_contract", teamCtr.getTeamPendingContract);
// router.post("/ended_team_contract", teamCtr.getEndedTeamContract);
//   return router;
// }

export default router;
