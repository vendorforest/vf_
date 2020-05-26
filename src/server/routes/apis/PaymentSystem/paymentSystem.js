import express from "express";
import { isAuthenticatedForApi } from "@Utils/middleware";

// import getUserCtr from "@Controllers/userController";
import getPaymentCtr from "@Controllers/paymentController";

export const paymentRouter = express.Router();
const paymentCtr = getPaymentCtr();
// const userCtr = getUserCtr();

//TODO: ***  MOVE any sensitive information into my environment
// get the user information from the userCtr, to choose if (client or vendor)
//2. mirror these endpoints to what Stripe is doing
paymentRouter.use(isAuthenticatedForApi);
paymentRouter.use("/charges/:charges", paymentCtr.createStripeCharges);
paymentRouter.use("/customers", paymentCtr.createStripeAccount);
paymentRouter.use("/token", paymentCtr.createToken);
paymentRouter.get("/authorize", paymentCtr.getAccountId);
paymentRouter.get("/stripe_web_hook", paymentCtr.stripeWebHook);
