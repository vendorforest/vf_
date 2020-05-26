import Team from "../models/team.model";
import getEnv, {
	constants
} from "@Config/index";
import User from "@Models/user.model";
import Contract from "@Models/contract.model";
import {
	mail
} from "@Config/mail";
import saveNotification from "@Config/notification";
import sendSMS from "@Config/sms";

const env = getEnv();

export default () => {
	const controllers = {};

	controllers.get = async (req, res, next) => {
		await Team.findById(req.query._id)
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
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

	controllers.getTeams = async (req, res, next) => {
		await Team.find({
				$or: [{
						admin: req.user._id,
					},
					{
						members: req.user._id,
					},
					{
						invitedUsers: req.user._id,
					},
				],
			})
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
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

	controllers.create = async (req, res, next) => {

		try{

			const team = await Team.create(req.body);

			const users = await User.find({ _id : { $in: team.members}});

			for (const user of users){

				const vendorTitle = "Vendorforest Info!";

				const notificationDescription = `You have been invited to "${req.body.name}" team.`;

				const smsDescription = `You have been invited to ${req.body.name} team. \n vendorforest.com`;

				saveNotification(user.username, notificationDescription, `/vendor/team/${team._id}`);

				sendSMS(user.phone, vendorTitle, smsDescription);

				const emailContent = { teamName: req.body.name, username: user.username, email: user.email };

				await mail.sendInvitingEmail( emailContent, "VendorForest information!");
			}
			
			return res.status(200).json({ status: 200, data: team, message: "Team has been created." });

		}catch(error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.update = async (req, res, next) => {
		await Team.findOneAndUpdate({
					_id: req.body._id,
					admin: req.user._id,
				},
				req.body, {
					new: true,
				},
			)
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
					message: "Team has been updated.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.inviteUsers = async (req, res, next) => {
		await Team.findOneAndUpdate({
				_id: req.body._id,
				admin: req.user._id,
			}, {
				$push: {
					invitedUsers: req.body.invitedUsers,
				},
			}, {
				new: true,
			}, )
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				await team.invitedUsers.map(async (invitedUser) => {
					const vendorId = invitedUser._id;
					const notificationDescription = `You have been invited to "${team.name}" team.`;
					const vendorPhone = invitedUser.phone;
					const vendorTitle = "Vendorforest Info!";
					const smsDescription = `You have been invited to ${team.name} team. \n vendorforest.com`;
					saveNotification(vendorId, notificationDescription, `/vendor/team/${team._id}`);
					sendSMS(vendorPhone, vendorTitle, smsDescription);
					const emailContent = {
						teamName: team.name,
						username: invitedUser.username,
						email: invitedUser.email,
					};
					await mail.sendInvitingEmail(
						emailContent,
						"VendorForest information!",
						(err, msg) => {
							if (err) {
								return err;
							}
							return;
						},
					);
				});
				return res.status(200).json({
					status: 200,
					data: team,
					message: "Members has been invited successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.inviteAccept = async (req, res, next) => {
		await Team.findOneAndUpdate({
				_id: req.body._id,
				invitedUsers: req.body.invitedUser,
			}, {
				$push: {
					members: req.body.invitedUser,
				},
				$pull: {
					invitedUsers: req.body.invitedUser,
				},
			}, {
				new: true,
			}, )
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
					message: "Invitation has been accepted successfully.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.inviteDecline = async (req, res, next) => {
		await Team.findOneAndUpdate({
				_id: req.body._id,
				invitedUsers: req.body.invitedUser,
			}, {
				$pull: {
					invitedUsers: req.body.invitedUser,
				},
			}, {
				new: true,
			}, )
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
					message: "Invitation has been decline.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.memberDecline = async (req, res, next) => {
		await Team.findOneAndUpdate({
				_id: req.body._id,
				members: req.body.memberId,
			}, {
				$pull: {
					members: req.body.memberId,
				},
			}, {
				new: true,
			}, )
			.populate({
				path: "admin",
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
				path: "members",
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
				path: "invitedUsers",
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
			.then(async (team) => {
				if (!team) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Team ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: team,
					message: "Member has been deleted.",
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getTeamPendingContract = async (req, res) => {
		try{

			console.log(req.body)

			const contracts = await Contract.find({ vendor: req.body.admin, status: req.body.status })
			
			.populate({ path: "proposal", model: "proposal", populate: { path: "offers", model: "offer" }})

			.populate({ path: "job", model: "job", 

				populate: [

					{ path: "category", model: "category" },

					{ path: "service", model: "service" },
				]})

			.populate({ path: "client", model: "user",

				populate: { path: "client", model: "client", select: { username: 1, bsLocation: 1, profileImage: 1, timeZone: 1 }}})

			.populate({ path: "vendor", model: "user",

				populate: { path: "vendor", model: "vendor", select: { username: 1, bsLocation: 1, profileImage: 1, timeZone: 1}}})

			.populate({ path: "reviews", model: "review",

				populate: [

					{ path: "from", model: "user", select: { username: 1 }},

					{ path: "to", model: "user", select: { username: 1 }},
				]
			});
			
			let pendingContractResult = contracts.filter((contractItem) => {

				if (contractItem.proposal.bidType === 1) {

					if (String(contractItem.proposal.offers[0].team) === String(req.body.teamId)) {

						return true;
					}
				}

				return false;
			});

			return res.status(200).json({ status: 200, data: pendingContractResult, message: "" });
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};
	return controllers;
};