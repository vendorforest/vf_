// import stripe from "stripe";
import User from "@Models/user.model";
import getEnv, { constants } from "@Config/index";

const env = getEnv();
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);
// import { config } from "dotenv";
// const crypto = require("crypto");
// //const passport = require('passport');
// const User = require("../models/user.model");
// const Token = require("../models/token.model");
// const Client = require("../models/client.model");
// const Vendor = require("../models/vendor.model");
// const constant = require("../Config/constants");
// TODO
// @ts-ignore
export default function(passport) {
  const controllers = {};
  // const stripePayload = new stripe("sk_test_PHS0wV5HZJ41uaZDQsgqHKQp");

  env.MODE === "development" && console.log("stripePayload");

  controllers.getAccountId = (req, res) => {
    req.session.state = Math.random()
      .toString(36)
      .slice(2);

    let parameters = {
      client_id: "ca_G69qhU4bRaQUrWwoYPRNlzu50gvOEgEy",
      state: req.session.state,
    };
    env.MODE === "development" && console.log(parameters);
    return res.status(200).json({
      status: 200,
      message: parameters,
    });
  };

  controllers.stripeWebHook = (req, res) => {
    var code = req.query.code;

    stripe.oauth
      .token({
        grant_type: "authorization_code",
        code: code,
      })
      .then(function(response) {
        // env.MODE === "development" && console.log(response);
        const connected_account_id = {
          connectedAccountId: response.stripe_user_id,
        };
        // const newAccountID = new User(connected_account_id);
        try {
          User.findOneAndUpdate(
            {
              email: req.user.email,
            },
            connected_account_id,
            {
              new: true,
            },
          ).then(
            env.MODE === "development" && console.log("Your Stripe account Id is saved."),
            res.redirect(`/${constants.ACCOUNTTYPES[req.user.accountType]}/settings`),
          );
        } catch (error) {
          env.MODE === "development" && console.log(error);
        }
        // newAccountID.save();
      });
  };

  // @ts-ignore
  controllers.createStripeCharges = async (req, res, next) => {
    const charges = req.param("charges");
    env.MODE === "development" && console.log("before stripe: ", charges);
    // @ts-ignore
    const status = await stripePayload.charges.create({
      amount: charges,
      currency: "usd",
      source: "tok_amex", // obtained with Stripe.js
      metadata: { order_id: "6735" },
    });
    next();
  };

  // @ts-ignore
  controllers.createToken = async (req, res) => {
    stripePayload.tokens.create(
      {
        card: {
          //TODO get this from user db.table
          number: "4242424242424242",
          exp_month: 12,
          exp_year: 2020,
          cvc: "123",
        },
      },
      async function(err, token) {
        // asynchronously called
        if (err) {
          env.MODE === "development" &&
            console.log("Error happened while creating a Stripe Token: ", err);
        }

        env.MODE === "development" && console.log("Token: ", token);

        res.status(200).send(token.id);
      },
    );
  };

  // @ts-ignore
  controllers.createStripeAccount = async (req, res, next) => {
    stripePayload.tokens.create(
      {
        card: {
          //TODO get this from user db.table
          number: "4242424242424242",
          exp_month: 12,
          exp_year: 2020,
          cvc: "123",
        },
      },
      // @ts-ignore
      async function(err, token) {
        // asynchronously called
        //TODO: get customer if exists otherwise
        // create customer
        env.MODE === "development" && console.log("token: ", token);
        // @ts-ignore
        const customer = await stripePayload.customers.create(
          {
            email: "jenny.rosen@example.com",
            source: token.id,
          },
          // @ts-ignore
          (err, customer) => {
            env.MODE === "development" && console.log("customers: ", customer);
          },
        );
      },
    );
  };
  //client deposits money into an escrow account
  // controllers.depositMoney = async (req, res, next) => {
  //   await User.findById(req.user._id)
  //     .populate("client")
  //     .then(async user => {})
  //     .catch(error => {});
  // };
  return controllers;
}
