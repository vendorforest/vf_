import express from "express";
import apis from "./apis";
import views from "./views";

const router = express.Router();

export default function (app, passport) {

	router.use("/apis", apis(app, passport));

	router.use("/", views);

	return router;
}