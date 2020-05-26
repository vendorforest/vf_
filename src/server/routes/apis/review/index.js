// @ts-nocheck
import express from "express";
import expressValidation from "express-joi-validation";

import getReviewCtr from "@Controllers/reviewController";
import { isAuthenticatedForApi } from "@Utils/middleware";
import { get, getReviews, create, update } from "./validation";

const router = express.Router();
const reviewCtr = getReviewCtr();
const validator = expressValidation.createValidator({ passError: true });

// export default function(app, passport) {
router.use(isAuthenticatedForApi);
router.get("/get", validator.query(get.query), reviewCtr.get);
router.get("/get_reviews", validator.query(getReviews.query), reviewCtr.getReviews);
router.get("/get_myreviews", validator.query(getReviews.query), reviewCtr.getMyReviews);
router.post("/create", validator.body(create.body), reviewCtr.create);
router.post("/update", validator.body(update.body), reviewCtr.update);

//   return router;
// }
export default router;
