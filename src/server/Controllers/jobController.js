import Job from "@Models/job.model";
import User from "@Models/user.model";
import Room from "@Models/chatRoom.model";
import Vendor from "@Models/vendor.model";
import Client from "@Models/client.model";
import Proposal from "@Models/proposal.model";
import Contract from "@Models/contract.model";
import QuestionAnswer from "@Models/question&answer.model";
import getEnv, { constants } from "@Config/index";
import mongoose from "mongoose";
import { mail } from "@Config/mail";
import saveNotification from "@Config/notification";
import sendSMS from "@Config/sms";


//send notification
const webpush = require("web-push");
const nodemailer = require("nodemailer");
// const emailTemplate = fs.readFileSync("/public/emails/email_new_jobs_arround_area.hjs", "utf-8");
// const compileTemplate = Hogan.compile(emailTemplate);
const twilio = require("twilio");
const env = getEnv();

// const io = socketio(server);

export default () => {
	const controllers = {};

	controllers.getClientJobs = async (req, res) => {
		let query = {
			client: req.user._id,
		};
		if (req.body.status) {
			query.$or = req.body.status.map((st) => {
				return {
					status: st,
				};
			});
		}
		await Job.find(query)
			.populate("service")
			.populate("category")
			.populate("client")
			.populate("invitedVendors")
			.populate({
				model: "proposal",
				path: "proposales",
				populate: {
					model: "user",
					path: "vendor",
				},
			})
			.sort({
				createdAt: -1,
			})
			.then(async (jobs) => {
				return res.status(200).json({
					status: 200,
					data: jobs,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.get = async (req, res) => {
		await Job.findById(req.query._id)
			.populate("service")
			.populate("category")
			.populate({
				path: "client",
				model: "user",
				populate: {
					path: "client",
					model: "client",
				},
			})
			.populate({
				path: "invitedVendors",
				model: "user",
				populate: {
					path: "vendor",
					model: "vendor",
					populate: [{
							path: "service",
							model: "service",
						},
						{
							path: "category",
							model: "category",
						},
					],
				},
			})
			.populate({
				model: "proposal",
				path: "proposales",
				populate: {
					model: "user",
					path: "vendor",
				},
			})
			.then(async (job) => {
				if (!job) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Job ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: job,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.create = async (req, res) => {

		try{

			const job = await Job.create({...req.body, client: req.user._id})

			await Client.findOneAndUpdate({_id: req.user.client}, {$inc: {postedJobs: 1, openJobs: 1}})

			// send notification
			const vendors = await Vendor.find({ category: req.body.category}, { _id: 1})

			const vendorIds = vendors.map(vendor => vendor._id);

			const vendorUsers = await User.find({vendor: {$in: vendorIds}})
			
			for (const user of vendorUsers){

				const notificationDescription = `New job posted The title is ${req.body.title}`;

				const vendorPhone = user.phone;

				const vendorTitle = "New job posted";

				const smsDescription = `Title: ${req.body.title} \n This job is matched well to your skill. \n vendorforest.com`;

				saveNotification(user._id, notificationDescription, `/vendor/job/${job._id}`);

				sendSMS(vendorPhone, vendorTitle, smsDescription);

				const emailContent = {

					title: req.body.title,

					description: req.body.description,

					email: user.email,
				};

				mail.sendVendorJobPostedEmail( emailContent, "VendorForest information!");
			}

			res.status(200).json({ status: 200, data: job, message: "Job has been published"});

			console.log(req.body.invitedVendors)

			if (req.body.invitedVendors && req.body.invitedVendors.length > 0) {

				const invitedUsers = User.find({ vendor: {$in: req.body.invitedVendors}})

				for (const user of invitedUsers) {

					const notiDescription = `You are invited to this job. Title: ${req.body.title}`;

					saveNotification(user._id, notiDescription, `/vendor/job/${job._id}`);

					sendSMS(user.phone, "You are invited to this job", `Title: ${req.body.title} \n Please bid on this job. \n vendorforest.com`);

					const now = new Date();

					const emailContent = {

						client: req.user.username,

						title: req.body.title,

						created: now.toUTCString(),

						budget: req.body.budget,

						user: user.username,

						email: user.email,
					};

					mail.sendVendorEmail( emailContent, "VendorForest information!");
				}
			}				
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.initChat = async (req, res) => {
		// const ObjectId = require("mongodb").ObjectID;
		const myName = req.user.username;
		const vendorID = req.body.vendor;
		await User.findOne({
				_id: mongoose.Types.ObjectId(vendorID)
			}, function (err, result) {
				if (err) {
					throw err;
				}
			})
			.then((result) => {
				const senderRoomInfo = new Room({
					user: myName,
					roomName: result.username,
				});
				senderRoomInfo.save();
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: error,
				});
			});
	};

	controllers.sendingNotification = (req, res) => {
		const title = req.body.post.title;
		const subscription = req.body.subscription;
		webpush.setVapidDetails(
			env.COMET_WEB_PUSH_CONTACT,
			env.COMET_PUBLIC_VAPID_KEY,
			env.COMET_PRIVATE_VAPID_KEY,
		);
		env.MODE === "development" && console.log("SUBscription list", subscription);

		const payload = JSON.stringify({
			title: "New job posted in Vendorforest.com",
			body: title,
		});
		webpush
			.sendNotification(subscription, payload)
			.then(
				(result) =>
				env.MODE === "development" && console.log("after sending notification", result),
			)
			.catch((e) => env.MODE === "development" && console.log(e.stack));

		res.status(200).json({
			success: true
		});
	};

	controllers.sendEmail = async (req, res) => {
		// create reusable transporter object using the default SMTP transport
		const country = req.body.location.country;
		const state = req.body.location.state;
		const city = req.body.location.city;
		const lat = req.body.postRadius;
		const title = req.body.title;
		const description = req.body.description;
		// query["location.city"] = req.body.location.city;
		await User.find({
				accountType: 1,
				"bsLocation.country": country,
				"bsLocation.state": state,
				"bsLocation.city": city,
				"bsLocation.lat": {
					$lt: lat
				},
			}, {
				email: 1,
				phone: 1,
				_id: 0,
			}, )
			.then((data) =>
				data.map(async (result) => {
					await mail.sendVendorEmail(result, "VendorForest information!", (err, msg) => {
						if (err) {
							return res.status(404).json({
								status: 404,
								message: "Email was not sent something went wrong!",
							});
						}
						return res.status(200).json({
							status: 200,
							message: "Email about this has been sent to vendors successfully.",
						});
					});
				}),
			)
			.catch((error) => env.MODE === "development" && console.log("error occured", error));
	};

	controllers.update = async (req, res) => {
		await Job.findOneAndUpdate({
					_id: req.body._id,
				},
				req.body, {
					new: true,
				},
			)
			.then(async (job) => {
				return res.status(200).json({
					status: 200,
					data: job,
					message: "Job has been updated successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.find = async (req, res) => {

		const statusQuery = req.body.status.map((st) => {

			return { status: st };
		});

		const query = {};

		if (statusQuery.length > 0) query.$or = statusQuery;

		if (req.body.service) query.service = req.body.service;

		if (req.body.category) query.category = req.body.category;

		if (req.body.client) query.client = req.body.client;

		if (req.body.budgetType !== undefined) query.budgetType = req.body.budgetType;

		if (req.body.vendorType !== undefined) query.vendorType = req.body.vendorType;

		if (req.body.location && req.body.location.country) query["location.country"] = req.body.location.country;

		if (req.body.location && req.body.location.city) query["location.city"] = req.body.location.city;
		
		if (req.body.title) {

			const re = new RegExp(req.body.title, "i");

			query["title"] = re;
		}

		console.log(query)

		await Job.find(query).populate("service").populate("category").populate({
				
			path: "proposales", model: "proposal", select: { vendor: 1 },

		}).populate({ path: "client", model: "user", populate: { path: "client", model: "client" } 

		}).populate({ path: "hiredVendors", model: "user", populate: { path: "vendor", model: "vendor" }

		}).sort({ createdAt: -1 }).then(async (jobs) => {

			return res.status(200).json({ status: 200, data: jobs });

		}).catch((error) => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		});
		
	};


	controllers.getMyPosts = async (req, res) => {
		await Job.find({
				client: req.user._id,
				status: constants.JOB_STATUS.PPOSTED,
			})
			.populate({
				path: "proposales",
				model: "proposal",
			})
			.sort({
				createdAt: -1
			})
			.then((result) => {
				return res.status(200).json({
					status: 200,
					data: result,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.hireVendor = async (req, res) => {
		var jobTitle;
		const newProposal = new Proposal({
			job: req.body.job,
			vendor: req.body.vendor,
			offerBudget: req.body.offerBudget,
			offerBudgetType: req.body.offerBudgetType,
			bidType: 0,
			status: constants.PROPOSAL_STATUS.HIRED,
		});
		await newProposal
			.save()
			.then(async (result) => {
				// console.log("saving proposal result = ", result);
				const newContract = new Contract({
					job: req.body.job,
					vendor: req.body.vendor,
					proposal: result._id,
					budget: req.body.offerBudget,
					stDateTime: req.body.stDateTime,
					endDateTime: req.body.endDateTime,
					client: req.user._id,
					totalBudget: req.body.offerBudget,
				});
				await newContract
					.save()
					.then(async (resul) => {
						// console.log("saving contract result = ", resul);
						await Job.findOneAndUpdate({
								_id: req.body.job,
							}, {
								status: constants.JOB_STATUS.HIRED,
								$push: {
									hiredVendors: req.body.vendor,
									proposales: result._id,
								},
							}, )
							.then((jobResult) => {
								// console.log("job result = ", jobResult);
								jobTitle = jobResult.title;
							})
							.catch((err) => {
								console.log("job catch error = ", err);
							});
						const vendorId = req.body.vendor;
						const notificationDescription = `You are hired. Job Title: ${jobTitle}. Message from client: ${req.body.message}`;
						const vendorPhone = req.body.phone;
						const vendorTitle = "Vendorforest Information!";
						const smsDescription = `Title: ${jobTitle} \n You are hired on this job by the clinet ${req.user.username}. \n vendorforest.com`;
						saveNotification(
							vendorId,
							notificationDescription,
							`/vendor/contract/${resul._id}`,
						);
						sendSMS(vendorPhone, vendorTitle, smsDescription);
						const emailContent = {
							email: req.body.email,
							contractId: resul._id,
							user: req.body.username,
							client: req.user.username,
							budget: req.body.offerBudget,
						};
						await mail.sendVendorHireByClientEmail(
							emailContent,
							"VendorForest information!",
							(err, msg) => {
								if (err) {
									return err;
								}
								return;
							},
						);

						return res.status(200).json({
							status: 200,
							data: resul,
						});
					})
					.catch((error) => {
						console.log("error in saving = ", error);
						return res.status(500).json({
							status: 500,
							message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
						});
					});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.askQuestion = async (req, res) => {
		const newQuestion = new QuestionAnswer({
			vendor: req.body.vendor,
			question: req.body.question,
			client: req.user._id,
			status: 0,
		});
		await newQuestion
			.save()
			.then(async (result) => {
				const vendorId = req.body.vendor;
				const notificationDescription = `You received a new question from the client.`;
				const vendorPhone = req.body.phone;
				const vendorTitle = "Vendorforest Information!";
				const smsDescription = `New question from client. \n ${req.body.question}`;
				saveNotification(vendorId, notificationDescription, `/question&answer`);
				sendSMS(vendorPhone, vendorTitle, smsDescription);
				const emailContent = {
					email: req.body.email,
				};
				await mail.sendVendorJobPostedEmail(
					emailContent,
					"VendorForest information!",
					(err, msg) => {
						if (err) {
							return err;
						}
						return;
					},
				);
				return res.status(200).json({
					status: 200,
					message: "Your question has been sent.",
					data: result,
				});
			})
			.catch((error) => {
				console.log("error in saving = ", error);
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};
	
	controllers.jobCompleted = async (req, res) => {
		await Contract.findOne({
				_id: req.body.contractId,
			})
			.populate({
				path: "client",
				model: "user",
			})
			.then(async (result) => {
				const clientEmail = result.client.email;
				const clientPhone = result.client.phone;
				const clientId = result.client._id;
				const smsDescription = `Title: ${req.body.title} \n Vendor completed this job. Please check the job. \n vendorforest.com`;
				saveNotification(
					clientId,
					`Vendor has completed the Job. Title is ${req.body.title}. Please confirm this.`,
					`/client/contract/${req.body.contractId}`,
				);
				sendSMS(clientPhone, "Vendor has completed the Job", smsDescription);
				//send email.
				await mail.sendJobCompletedEmail(
					result.client,
					"VendorForest information!",
					(err, msg) => {
						if (err) {
							return err;
						}
						return;
					},
				);
				return res.status(200).json({
					status: 200,
					message: "Your confirmation has been delievered.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	return controllers;
};