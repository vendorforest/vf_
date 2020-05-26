import express from "express";
import client from "./client";
import vendor from "./vendor";
import review from "./review";
import portfolio from "./portfolio";
import home from "./home";
import job from "./job";
import proposal from "./proposal";
import offer from "./offer";
import contract from "./contract";
import milestone from "./milestone";
import service from "./service";
import team from "./team";
import user from "./user";
import chat from "./chat";
import { paymentRouter } from "@Routes/apis/PaymentSystem";

export default function (app, passport) {

	const router = express.Router();

	router.use("/", (req, res, next) => {

		console.log(req.method, `: /apis${req.url}`)

		next();
	});

	router.use("/job", job);

	router.use("/client", client);

	router.use("/vendor", vendor);

	router.use("/review", review);

	router.use("/portfolio", portfolio);

	router.use("/proposal", proposal);

	router.use("/offer", offer);

	router.use("/contract", contract);

	router.use("/service", service);

	router.use("/team", team);

	router.use("/milestone", milestone);

	router.use("/payment", paymentRouter);

	router.use("/home", home);

	router.use("/chat", chat);

	router.use("/", user(app, passport));

	router.use((err, req, res, next) => {

		console.log("router Error", err);

		if (err && err.error && err.error.name === "ValidationError") {

			return res.status(400).json({ status: 400, message: err.error.details[0].message });

		} else {

			return res.status(400).json({ status: 400, message: err.toString() });
		}
	});

	return router;
}