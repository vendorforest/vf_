import User from "@Models/user.model";
import Client from "@Models/client.model";
import Notification from "@Models/notification.model";
import getStripCtrl from "@Controllers/stripe";
import getEnv, { constants } from "@Config/index";

const env = getEnv();

const stripeCtr = getStripCtrl();

const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

export default () => {

	const controllers = {};

	//client deposits money into an escrow account

	controllers.depositMoney = async (req, res, next) => {

		await User.findById(req.user._id).populate("client")
			.then(async (user) => {})
			.catch((error) => {});
	};


	controllers.getSetupIntent = async (req, res) => {

		const intent = await stripe.setupIntents.create();

		return res.json({ client_secret: intent.client_secret });
	};


	controllers.getBilling = async (req, res) => {

		await User.findById(req.user._id).populate("client").then(async (user) => {

			if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });

			let stripeCustomer = {}

			if (!user.client.customerId) {

				stripeCustomer = await stripeCtr.createCustomer({name: user.username, email: user.email})

				user.client = await Client.findOneAndUpdate({_id: user.client._id}, {customerId: stripeCustomer.id}, {new: true})
			}

			stripeCustomer = await stripeCtr.getCustomer(user.client.customerId)

			return res.status(200).json({ status: 200, data: stripeCustomer});

		}).catch(error => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		})
	};


	controllers.updateBilling = async (req, res) => {

		await User.findById(req.user._id).populate("client").then(async (user) => {

			if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });

			let stripeCustomer = {}

			if (!user.client.customerId) {

				stripeCustomer = await stripeCtr.createCustomer({name: user.username, email: user.email})

				user.client = await Client.findOneAndUpdate({_id: user.client._id}, {customerId: stripeCustomer._id}, {new: true})
			}

			stripeCustomer = await stripeCtr.updateCustomer(user.client.customerId, {source: req.body.cardToken})

			return res.status(200).json({ status: 200, data: stripeCustomer});

		}).catch(error => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		})
	};

	controllers.get = async (req, res, next) => {

		env.MODE === "development" && console.log("get should call this");

		await User.findById(req.user._id).populate("client").then(async (user) => {

			if (!user) {

				return res.status(401).json({status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG});
			}

			return res.status(200).json({ status: 200, data: user });

		}).catch((error) => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		});
	};


	//client updates account billing information
	controllers.updateBillingInformation = async (req, res, _next) => {
		await User.findById(req.user._id)
			.populate("client")
			.then(async (user) => {
				if (!user) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`User ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				env.MODE === "development" && console.log("updateBillingInformation ", req.body);
				const _card = {
					card: {
						//TODO get this from user db.table
						number: req.body.number,
						exp_month: req.body.exp_month,
						exp_year: req.body.exp_year,
						cvc: req.body.cvc,
					},
				};
				//TODO IF STRIPE
				stripePayload.tokens.create({
						// @ts-ignore
						card: {
							number: req.body.number,
							exp_month: req.body.exp_month,
							exp_year: req.body.exp_year,
							cvc: req.body.cvc,
						},
					},
					async function (err, token) {
						env.MODE === "development" &&
							console.log("err: ", err, "token: ", token, " user ", user);
						if (err) {
							return res.status(400).json({
								status: 400,
								data: user,
								message: err.message,
							});
						}
						//TODO token has the object we need to store!!!
						const customer = await this.stripePayload.customers.create({
								email: user.email,
								source: token.id,
							},
							(_err, customer) => {
								env.MODE === "development" && console.log("customers: ", customer);
							},
						);
					},
				);
				// await Client.findOneAndUpdate(
				//   {
				//     _id: user.client._id,
				//   },
				//   {
				//     billingMethod: req.body.billingMethod,
				//     creditCard: {
				//       ...req.body,
				//     },
				//   },
				//   {
				//     new: true,
				//   },
				// )
				//   .then(async (client) => {
				//     env.MODE === "development" && console.log("resolve client!!! ", client);
				//     if (!client) {
				//       return res.status(401).json({
				//         status: 401,
				//         message:
				//           env.MODE === "development"
				//             ? `Client ${constants.DEV_EMPTYDOC_MSG}`
				//             : constants.PROD_COMMONERROR_MSG,
				//       });
				//     }
				//     user.client = client;
				// return res.status(200).json({
				//   status: 200,
				//   data: user,
				//   message: "Billing information has been updated",
				// });
				//   })
				//   .catch((error) => {
				//     throw new Error(error.message);
				//   });
			})
			.catch((_error) => {});
	};

	controllers.updateNotifySettings = async (req, res, _next) => {
		await User.findById(req.user._id)
			.populate("client")
			.then(async (user) => {
				if (!user) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`User ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				await Client.findOneAndUpdate({
						_id: user.client._id,
					}, {
						notification: {
							...user.client.notification,
							...req.body,
						},
					}, {
						new: true,
					}, )
					.then(async (client) => {
						if (!client) {
							return res.status(401).json({
								status: 401,
								message: env.MODE === "development" ?
									`Client ${constants.DEV_EMPTYDOC_MSG}` :
									constants.PROD_COMMONERROR_MSG,
							});
						}
						user.client = client;
						return res.status(200).json({
							status: 200,
							data: user,
							message: "Notification setting has been updated",
						});
					})
					.catch((error) => {
						throw new Error(error.message);
					});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getNotifications = async (req, res) => {
		const user = req.user._id;
		const query = {
			username: user,
			status: req.body.status
		};
		await Notification.find(query)
			.sort({
				createdAt: -1
			})
			.then((result) => {
				return res.status(200).json({
					data: result,
				});
			})
			.catch((err) => env.MODE === "development" && console.log("err = ", err));
	};

	controllers.getDeletedNotifications = async (req, res) => {
		const user = req.user._id;
		const query = {
			username: user,
			status: req.body.status
		};
		await Notification.find(query)
			.sort({
				createdAt: -1
			})
			.then((result) => {
				return res.status(200).json({
					data: result,
				});
			})
			.catch((err) => env.MODE === "development" && console.log("err = ", err));
	};

	controllers.delNotification = async (req, res) => {
		// await Notification.find({ username: ObjectId(user) })
		await Notification.findOneAndUpdate({
				_id: req.body._id,
			}, {
				status: req.body.status,
			}, )
			.then((result) => {
				return res.status(200).json({
					data: result,
					message: "Notification has been deleted successfully.",
				});
			})
			.catch((err) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	return controllers;
};