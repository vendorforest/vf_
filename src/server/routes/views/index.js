import express from "express";

import client from "./client";
import vendor from "./vendor";
import user from "./user";

// export default function(app, passport) {
const router = express.Router();

router.use("/client", client);
router.use("/vendor", vendor);
router.use("/", user);
// router.use("/", user(app, passport));

// return router;
// }

export default router;
