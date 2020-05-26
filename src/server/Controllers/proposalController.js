import Job from "@Models/job.model";
import Proposal from "@Models/proposal.model";
import Offer from "@Models/offer.model";
import User from "@Models/user.model";
import getEnv, { constants } from "@Config/index";
import saveNotification from "@Config/notification";
import sendSMS from "@Config/sms";
import { mail } from "@Config/mail";
import Notification from "@Models/notification.model";

const env = getEnv();

export default () => {

	const controllers = {};

	controllers.create = async (req, res, next) => {

		try{
			console.log(req.body)

			const offersData = req.body.offers; delete req.body.offers;

			let proposal = await Proposal.findOne({ job: req.body.job, vendor: req.body.vendor });

			if (proposal) return res.status(400).json({ status: 400, message: "You has been bided to this job already." });
	
			proposal = await Proposal.create(req.body);

			let offers = []

			if (req.body.bidType === constants.BID_TYPE.TEAM && offersData.length > 0) {

				const offerPromise = offersData.map((offer) => {

					console.log({ proposal: proposal._id, status: constants.OFFER_STATUS.CREATED, ...offer })

					return Offer.create({ proposal: proposal._id, status: constants.OFFER_STATUS.CREATED, ...offer });
				});

				offers = await Promise.all(offerPromise);

				const offerIds = offers.map(offer => offer._id)

				proposal = await Proposal.findOneAndUpdate({ _id: proposal._id }, {offers: offerIds}, { new: true})
			}

			const job = await Job.findOneAndUpdate({ _id: req.body.job }, { $push: { proposales: proposal._id }})
				
			res.status(200).json({ status: 200, message: "Your proposal has been submitted successfully"});

			if (offers.length > 0){

				offers.map(async (offer) => {

					const invitedVendor = await User.findOne({ _id: offer.receiver })

					const notificationDescription = `You have been invited to team working. Budget: $${offer.budget} of $${req.body.offerBudget}`;

					const vendorPhone = invitedVendor.phone;

					const vendorTitle = "Vendorforest Info!";

					const smsDescription = `You have been invited to team working. \n Budget: $${offer.budget} of $${req.body.offerBudget} \n vendorforest.com`;

					saveNotification( invitedVendor._id, notificationDescription, `/notification`, proposal._id);

					sendSMS(vendorPhone, vendorTitle, smsDescription);

					const emailContent = { username: invitedVendor.username, email: invitedVendor.email, budget: offer.budget };

					await mail.sendTeamWorkingInviteEmail( emailContent, "VendorForest information!");
				});
			}
			
			saveNotification(job.client._id, `${req.user.username} has bidded on your job post. Please check that bid.`, `/client/job/${req.body.job}`);

			sendSMS( job.client.phone, `${req.user.username} has bidded on your job post.`, `Please check that bid. \n vendorforest.com` );

		} catch (error ){

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.update = async (req, res, next) => {
		await Proposal.findOneAndUpdate({
					_id: req.body._id,
				},
				req.body, {
					new: true,
				},
			)
			.then(async (proposal) => {
				return res.status(200).json({
					status: 200,
					message: "Your proposal has been updated successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.delete = async (req, res, next) => {
		await Proposal.findOneAndUpdate({
				_id: req.body._id,
			}, {
				status: constants.PROPOSAL_STATUS.DECLINE,
			}, {
				new: true,
			}, )
			.then(async (proposal) => {
				return res.status(200).json({
					status: 200,
					message: "Proposal has been declined.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.get = async (req, res, next) => {
		await Proposal.findOne({
				_id: req.query._id,
			})
			.populate("job")
			.populate({
				path: "vendor",
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
				path: "offers",
				model: "offer",
			})
			.then(async (ps) => {
				return res.status(200).json({
					status: 200,
					data: ps,
				});
			})
			.catch((error) => {
				env.MODE === "development" && console.log(error);
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getProposales = async (req, res, next) => {
		await Proposal.find(req.query)
			.populate("job")
			.populate({
				path: "vendor",
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
				path: "offers",
				model: "offer",
			})
			.then(async (ps) => {
				return res.status(200).json({
					status: 200,
					data: ps,
				});
			})
			.catch((error) => {
				env.MODE === "development" && console.log(error);
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.acceptTeamOffer = async (req, res) => {
		Proposal.findOneAndUpdate({
				_id: req.body.proposalId,
			}, {
				$inc: {
					bidType: 1
				},
			}, )
			.populate({
				path: "vendor",
				model: "user",
			})
			.then(async (proposal) => {
				const vendorId = proposal.vendor._id;
				const notificationDescription = `${req.user.username} has been accepted to team working.`;
				const vendorPhone = proposal.vendor.phone;
				const vendorTitle = "Vendorforest Info!";
				const smsDescription = `${req.user.username} has been accepted to team working. \n vendorforest.com`;
				await saveNotification(vendorId, notificationDescription, `/notification`);
				await sendSMS(vendorPhone, vendorTitle, smsDescription);
				await Notification.findOneAndUpdate({
					username: req.user._id,
					proposalId: req.body.proposalId,
				}, {
					status: constants.NOTIFICATION_STATUS.DELETED,
				}, );
				if (proposal.bidType === proposal.offers.length) {
					Proposal.findOneAndUpdate({
							_id: req.body.proposalId,
						}, {
							bidType: -1,
						}, )
						.populate({
							path: "vendor",
							model: "user",
						})
						.then(async (proposalResult) => {
							const vendorId = proposalResult.vendor._id;
							const notificationDescription = `All of your team members accepted the bid. Your team can start work from now.`;
							const vendorPhone = proposalResult.vendor.phone;
							const vendorTitle = "Vendorforest Info!";
							const smsDescription = `All of your team members accepted your offer. Your proposal submitted. \n vendorforest.com`;
							await saveNotification(vendorId, notificationDescription, `/notification`);
							await sendSMS(vendorPhone, vendorTitle, smsDescription);
						})
						.catch((error) => {
							env.MODE === "development" && console.log(error);
							return res.status(500).json({
								status: 500,
								message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
							});
						});
				}
				return res.status(200).json({
					status: 200,
					message: "Successfully Accepted",
				});
			})
			.catch((error) => {
				env.MODE === "development" && console.log(error);
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};
	return controllers;
};