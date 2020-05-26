import express from "express";

import getChatCtr from "@Controllers/chatController";
import { isAuthenticatedForApi } from "@Utils/middleware";

const chatCtr = getChatCtr();
const router = express.Router();

router.use(isAuthenticatedForApi);
router.get("/get_connected_users", chatCtr.getConnectedUser);
router.post("/get_old_msg", chatCtr.getOldMsg);
export default router;
