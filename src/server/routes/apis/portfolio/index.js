import express from "express";
import expressValidation from "express-joi-validation";
import getPortfolioCtr from "@Controllers/portfolioController";
import getUploadCtr from '@Controllers/upload';
import { isAuthenticatedForApi } from "@Utils/middleware";
import { get, getMyPortfolios, create, update, upload_video, delete_portfolio } from "./validation";
const router = express.Router();
const validator = expressValidation.createValidator({ passError: true });
const portfolioCtr = getPortfolioCtr();
const uploadCtr = getUploadCtr();

router.post("/upload_image", uploadCtr.fileUpload, isAuthenticatedForApi, portfolioCtr.uploadImage);

router.use(isAuthenticatedForApi);

router.get("/get_myportfolios", validator.body(getMyPortfolios.query),portfolioCtr.getMyPortfolios);

router.get("/get", validator.query(get.query), portfolioCtr.get);

router.post("/create", validator.body(create.body), portfolioCtr.create);

router.post("/update", validator.body(update.body), portfolioCtr.update);

router.post("/upload_video", validator.body(upload_video.body), portfolioCtr.uploadVideo);

router.post("/delete", validator.body(delete_portfolio.body), portfolioCtr.delete);

export default router;
