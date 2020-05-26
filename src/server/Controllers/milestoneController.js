// @ts-nocheck
import Milestone from "@Models/milestone.model";
import User from "@Models/user.model";
import Vendor from "@Models/vendor.model";
import Contract from "@Models/contract.model";
import Proposal from "@Models/proposal.model";
import Notifi from "@Models/notification.model";
import getEnv, { constants } from "@Config/index";
import {mail} from "@Config/mail";
import saveNotification from "@Config/notification";
import getStripeCtr from "@Controllers/stripe"
import sendSMS from "@Config/sms";
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const env = getEnv();
const stripe = require("stripe")(env.STRIPE_SECRET_KEY);

const stripeCtr = getStripeCtr();

export default () => {

	const controllers = {};
	
	controllers.create = async (req, res, next) => {

		try{

			const user = await User.findOne({ _id: req.user._id }).populate('client');

			if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });
			
			const isMatch = user.verifyPassword(req.body.password);

			if (!isMatch) return res.status(403).json({status: 400, message: "Your Password is not matched. Please try again." });

			let contract = await Contract.findOne({ _id: req.body.contract })

			if (!contract) return res.status(401).json({ status: 401, message: env.NODE_ENV === "development" ? `Milestone ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });
			
			const paymentIntent = await stripeCtr.createPymentIntent(user.client.customerId, { amount: req.body.price})

			const milestone = await Milestone.create({ description: req.body.description, price: req.body.price, contract: req.body.contract});
			
			if (!milestone) return res.status(401).json({ status: 401, message: env.NODE_ENV === "development" ? `Milestone ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });

			contract = await Contract.findOneAndUpdate({ _id: contract._id }, { $inc: { escrowPrice: milestone.price }, budget: req.body.budget }).populate({ path: "vendor", model: "user"});
					
			const emailTitle = "Milestone has been created.";

			const description = `You can start work on this job. Your accepted budget is ${milestone.price} USD.`;

			const phoneDescription = `You can start work on this job.\n Your accepted budget is ${milestone.price} USD.`;

			saveNotification( contract.vendor._id, description, `/vendor/contract/${req.body.contract}` );

			sendSMS(contract.vendor.phone, emailTitle, phoneDescription);

			await mail.sendCreateMilestoneEmail( contract.vendor, "VendorForest information!");
			
			return res.status(200).json({ status: 200, data: milestone, message: "Milestone has been created successfully." });

		} catch (error) {

			console.log(error)

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	
	controllers.update = async (req, res, next) => {

		try{

			const milestone = await Milestone.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true });
			
			if (!milestone) return res.status(401).json({ status: 401, message: env.NODE_ENV === "development" ? `Milestone ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG});

			return res.status(200).json({ status: 200, data: milestone, message: "Milestone has been updated successfully." });

		} catch (error) {

			return res.status(500).json({ status: 500, message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.release = async (req, res, next) => {

		try {

			let milestone = await Milestone.findOne({ _id: req.body._id })

			const contract = await Contract.findById(milestone.contract);

			const proposal = await Proposal.findById(contract.proposal).populate({ path: "offers", model: "offer",
				
				populate: { path: 'receiver', model: 'user', 
				
				populate: { path: 'vendor', model: 'vendor'}}});

			const vendor = await User.findById(proposal.vendor).populate('vendor')

			if (!milestone) return res.status(401).json({ status: 401, message: env.NODE_ENV === "development" ? `Milestone ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });
			
			env.MODE === "development" && console.log("fetch milestone result === ", milestone);

			let transferData = []

			if (proposal.offers && proposal.offers.length > 0){

				const releaseTotalAmount = milestone.price * 0.75;

				const contratTotalAmount = contract.totalBudget * 0.75;

				let offerReleaseAmount = 0;

				transferData = proposal.offers.map(offer => {

					const receiverRleaseAmount = Math.ceil((offer.budget / contratTotalAmount) * releaseTotalAmount)

					offerReleaseAmount += receiverRleaseAmount;

					return { vendor: offer.receiver, amount: receiverRleaseAmount}
				})

				transferData.push({ vendor: vendor, amount: releaseTotalAmount - offerReleaseAmount})

				for (const data of transferData){

					const stripeTransfer = await stripeCtr.createTransfers(data.vendor.vendor.connectedAccountId, {amount: data.amount})

					console.log(stripeTransfer)
				}

				const vendorUpdatePromise = transferData.map(data => {

					return Vendor.findOneAndUpdate({ _id: data.vendor.vendor._id}, { $inc: { totalEarning: data.amount }})
				})

				await Promise.all(vendorUpdatePromise);

			}else{

				const transferAmount = Math.ceil(milestone.price * 0.75);

				const stripeTransfer = await stripeCtr.createTransfers(vendor.vendor.connectedAccountId, {amount: transferAmount})

				await Vendor.findOneAndUpdate({ _id: vendor.vendor._id}, { $inc: { totalEarning: transferAmount }})
			}
			
			milestone = await Milestone.findOneAndUpdate({ _id: milestone._id }, { status: constants.MILESTONE_STATUS.RELEASED }, { new: true});

			await Contract.findOneAndUpdate({ _id: contract._id }, { $inc: { paidPrice: milestone.price, escrowPrice: -milestone.price }}, {new: true});
					
			res.status(200).json({ status: 200, data: milestone, message: "Milestone has been released successfully." });

			const emailTitle = "Milestone has been released.";

			if (transferData.length > 0){

				for (const data of transferData) {

					const description = `Milestone has been released. Your client released the milestone. Amount is ${data.amount} USD.`;
	
					const phoneDescription = `Milestone has been released.\n Your client released the milestone. Amount is ${data.amount} USD. \n vendorforest.com`;
		
					saveNotification(data.vendor.username, description, `/vendor/contract/${contract._id}`);
		
					sendSMS(data.vendor.phone, emailTitle, phoneDescription);
		
					await mail.sendReleaseMilestoneEmail( data.vendor, "VendorForest information!");
				}
			}else{

				const description = `Milestone has been released. Your client released the milestone. Amount is ${milestone.price * 0.75} USD.`;
	
				const phoneDescription = `Milestone has been released.\n Your client released the milestone. Amount is ${milestone.price *0.75} USD. \n vendorforest.com`;
	
				saveNotification(vendor.username, description, `/vendor/contract/${contract._id}`);
	
				sendSMS(vendor.phone, emailTitle, phoneDescription);
	
				await mail.sendReleaseMilestoneEmail( vendor, "VendorForest information!");
			}
		} catch (error) {

			env.MODE === "development" && console.log("err ocurred &&&&&", error);

			return res.status(500).json({ status: 500, message: `Errors ${error}` });
		}
	};

	const sendingEmail = async (emailAddress, title, description) => {
		const transporter = nodemailer.createTransport({
			host: "smtp.gmail.com",
			port: 587,
			secure: false,
			auth: {
				user: env.SUPPORT_EMAIL,
				pass: env.SUPPORT_SECRET,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		// send mail with defined transport object
		const info = await transporter.sendMail({
			from: '"VendorForest Support Team" <vendorforest@gmail.com>', // sender address
			to: emailAddress, // list of receivers
			subject: title,
			text: "Vendorforest.com",
			html: `<h1 style={color: blue; font-weight: bold;}>${title}</h1><div>${description}</div>`,
		});

		env.MODE === "development" && console.log("Message sent: %s", info.messageId);
	};

	const sendingSms = async (phone, title, description) => {
		const accountSid = env.TWILIO_ACCOUNT_SID;
		const authToken = env.TWILIO_AUTH_TOKEN;
		const client = twilio(accountSid, authToken);
		try {
			client.messages
				.create({
					to: phone,
					from: env.SERVER_TWILIO_NUMBER,
					body: `${title} ${description}`,
				})
				.then((message) => env.MODE === "development" && console.log(message.sid));
			env.MODE === "development" && console.log("end");
		} catch (error) {
			env.MODE === "development" && console.log(error);
		}
	};

	const saveReleaseNotification = async (vendorId, price) => {
		const time = new Date().toLocaleString();
		const query = new Notifi({
			username: vendorId,
			notificationMsg: `Milestone Released. Amount is ${price} USD`,
			time: time,
		});
		await query.save();
	};

	controllers.reqRelease = async (req, res, next) => {
		await Milestone.findOneAndUpdate({
				_id: req.body._id,
			}, {
				status: constants.MILESTONE_STATUS.REQ_RELEASED,
			}, {
				new: true,
			}, )
			.then(async (milestone) => {
				if (!milestone) {
					return res.status(401).json({
						status: 401,
						message: env.NODE_ENV === "development" ?
							`Milestone ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: milestone,
					message: "Request has been sent successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.cancel = async (req, res, next) => {
		await Milestone.findOneAndRemove({
				_id: req.body._id,
			})
			.then(async (milestone) => {
				if (!milestone) {
					return res.status(401).json({
						status: 401,
						message: env.NODE_ENV === "development" ?
							`Milestone ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: milestone,
					message: "Milestone has been removed successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.get = async (req, res, next) => {
		await Milestone.findById(req.query._id)
			.populate({
				path: "constract",
				model: "constract",
			})
			.then(async (milestone) => {
				if (!milestone) {
					return res.status(401).json({
						status: 401,
						message: env.NODE_ENV === "development" ?
							`Milestone ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: milestone,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getMilestones = async (req, res, next) => {
		await Milestone.find(req.query)
			.then(async (milestones) => {
				return res.status(200).json({
					status: 200,
					data: milestones,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.milestoneResult = async (req, res, next) => {
		await Milestone.find(req.body)
			.then(async (milestones) => {
				return res.status(200).json({
					status: 200,
					data: milestones,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	return controllers;
};