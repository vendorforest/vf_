import Job from "@Models/job.model";
import Proposal from "@Models/proposal.model";
import Contract from "@Models/contract.model";
import Vendor from "@Models/vendor.model";
import Client from "@Models/client.model";
import Dispute from "@Models/dispute.model";
import getEnv, { constants } from "@Config/index";
import { mail } from "@Config/mail";
import saveNotification from "@Config/notification";
import sendSMS from "@Config/sms";

const env = getEnv();

export default () => {

	const controllers = {};
	
	controllers.create = async (req, res, next) => {

		try{

			const contract = await Contract.create({...req.body, client: req.user._id, totalBudget: req.body.budget})

			const proposal = await Proposal.findOneAndUpdate({ _id: contract.proposal }, { status: constants.PROPOSAL_STATUS.HIRED})

			await Job.findOneAndUpdate({ _id: proposal.job }, { status: constants.JOB_STATUS.HIRED, $push: { hiredVendors: req.body.vendor }})
					
			return res.status(200).json({ status: 200, data: contract, message: "Contract has been created successfully." });
			
		} catch(error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.update = async (req, res, next) => {

		console.log(req.body)

		try{
			const contract = await Contract.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })

				.populate({ path: "job", model: "job", select: { title: 1, budgetType: 1 }})

				.populate({ path: "client", model: "user", 

					populate: { path: "client", model: "client",

						select: { username: 1, bsLocation: 1, profileImage: 1, timeZone: 1 } 
					}
				}).populate({ path: "vendor", model: "user", 

					populate: { path: "vendor", model: "vendor",

						select: { username: 1, bsLocation: 1, profileImage: 1, timeZone: 1 }
					},
				}).populate({ path: "reviews", model: "review",

					populate: [
						
						{ path: "from", model: "user", select: { username: 1 } }, 
						
						{ path: "to", model: "user", select: { username: 1 } },
					]
				});
				
			return res.status(200).json({ status: 200, data: contract, message: "Contract has been updated successfully." });
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.end = async (req, res, next) => {

		try{

			const contract = await Contract.findOneAndUpdate({ _id: req.body._id }, { 
				
				status: constants.CONTRACT_STATUS.END, isCompleted: true, completedPercent: 100, completedDateTime: new Date()

			}, {new: true })
			
			.populate({ path: "job", model: "job",}).populate({ path: "client", model: "user",

				populate: { path: "client", model: "client"},

			}).populate({ path: "vendor", model: "user",

				populate: { path: "vendor", model: "vendor"},

			}).populate({ path: "reviews", model: "review",
			
				populate: [

					{ path: "from", model: "user",select: { username: 1 } },

					{ path: "to", model: "user", select: { username: 1 } },
				],
			})

			const proposal = await Proposal.findById(contract.proposal).populate({ path: "offers", model: "offer",
				
				populate: { path: 'receiver', model: 'user'}});
			
			await Client.findOneAndUpdate({ _id: req.user.client }, { $inc: { totalSpent: contract.paidPrice }})

			const vendor = contract.vendor.vendor, newCompletedRate = 100;

			const jobCompletedRate = Math.ceil((vendor.jobCompletedRate * vendor.jobs + newCompletedRate) / (vendor.jobs + 1))

			await Vendor.findOneAndUpdate({ _id: vendor._id }, { jobCompletedRate: jobCompletedRate, $inc: { jobs: 1 } } )

			if (proposal.offers && proposal.offers.length > 0){

				const offerVendorPromise = proposal.offers.map(offer => {

					return Vendor.findOneAndUpdate({ _id: offer.receiver.vendor}, {$inc: {jobs: 1}})
				})
	
				await Promise.all(offerVendorPromise);
			}

			return res.status(200).json({ status: 200, contract: contract, message: "Contract has been ended successfully." });
					
		} catch(error ) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.updateHireProposal = async (req, res) => {
		// console.log(req.body);
		await Contract.findOneAndUpdate({
				_id: req.body.contract,
			}, {
				budget: req.body.updatePrice,
			}, {
				new: true,
			}, )
			.then(async () => {
				await Job.findOneAndUpdate({
						_id: req.body.job,
					}, {
						title: req.body.updateTitle,
						description: req.body.updateDescription,
					}, {
						new: true,
					}, )
					.then(async (result) => {
						return res.status(200).json({
							status: 200,
							message: `Your proposal has been updated successfully.`,
						});
					})
					.catch((error) => {
						return res.status(500).json({
							status: 500,
							message: `${error} Failed to update. Please try again.`,
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

	controllers.getHireDetail = async (req, res) => {
		const jobId = req.body.job_id;
		const vendorId = req.body.vendor_id;
		await Contract.findOne({
				job: jobId,
				vendor: vendorId,
			})
			.populate({
				path: "vendor",
				model: "user",
			})
			.populate({
				path: "proposal",
				model: "proposal",
			})
			.populate({
				path: "job",
				model: "job",
				populate: [{
						path: "category",
						model: "category",
					},
					{
						path: "service",
						model: "service",
					},
				],
			})
			.then(async (result) => {
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

	controllers.get = async (req, res, next) => {
		await Contract.findById(req.query._id)
			.populate({
				path: "job",
				model: "job",
				select: {
					title: 1,
					budgetType: 1,
				},
			})
			.populate({
				path: "client",
				model: "user",
				populate: {
					path: "client",
					model: "client",
					select: {
						username: 1,
						bsLocation: 1,
						profileImage: 1,
						timeZone: 1,
					},
				},
			})
			.populate({
				path: "vendor",
				model: "user",
				populate: {
					path: "vendor",
					model: "vendor",
					select: {
						username: 1,
						bsLocation: 1,
						profileImage: 1,
						timeZone: 1,
					},
				},
			})
			.populate({
				path: "proposal",
				model: "proposal",
			})
			.populate({
				path: "reviews",
				model: "review",
				populate: [{
						path: "from",
						model: "user",
						select: {
							username: 1,
						},
					},
					{
						path: "to",
						model: "user",
						select: {
							username: 1,
						},
					},
				],
			})
			.then(async (contract) => {
				if (!contract) {
					return res.status(401).json({
						status: 401,
						message: env.MODE === "development" ?
							`Contract ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: contract,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getContracts = async (req, res, next) => {
		await Contract.find(req.query)
			.populate({
				path: "job",
				model: "job",
			})
			.populate({
				path: "client",
				model: "user",
				select: {
					username: 1,
					bsLocation: 1,
					profileImage: 1,
					timeZone: 1,
				},
			})
			.populate({
				path: "vendor",
				model: "user",
				select: {
					username: 1,
					bsLocation: 1,
					profileImage: 1,
					timeZone: 1,
				},
			})
			.populate({
				path: "reviews",
				model: "review",
				populate: [{
						path: "from",
						model: "user",
						select: {
							username: 1,
						},
					},
					{
						path: "to",
						model: "user",
						select: {
							username: 1,
						},
					},
				],
			})
			.then(async (contracts) => {
				return res.status(200).json({
					status: 200,
					data: contracts,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.saveDispute = async (req, res, next) => {
		const time = new Date().toLocaleString();
		const newDispute = new Dispute({
			...req.body,
			time: time,
		});
		await newDispute
			.save()
			.then(async (result) => {
				const id = result._id;
				await Dispute.find()
					.then(async (results) => {
						const count = results.length;
						await Dispute.findOneAndUpdate({
								_id: id,
							}, {
								queue: count,
							}, )
							.populate({
								path: "vendorId",
								model: "user",
							})
							.then(async (resul) => {
								const vendorPhone = resul.vendorId.phone;
								const vendorId = resul.vendorId._id;
								const smsDescription = `Job Title: ${req.body.title} \n Your Client has been disputed on this project. Please check the job. \n vendorforest.com`;
								saveNotification(
									vendorId,
									`Your Client has been disputed on this project. Title is ${req.body.title}. Please confirm this.`,
									`/vendor/contract/${req.body.contractId}`,
								);
								const sendInfo = resul;
								sendInfo.email = resul.vendorId.email;
								sendSMS(vendorPhone, "VendorForest information!", smsDescription);
								//send email.
								await mail.sendDisputeEmail(
									sendInfo,
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
									queue: count,
								});
							})
							.catch((error) => {
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
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.fetchDisputes = async (req, res) => {
		await Dispute.find(req.body)
			.then((result) => {
				const count = result.length;
				return res.status(200).json({
					status: 200,
					value: count,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getPendingDispute = async (req, res) => {
		const query =
			req.user.accountType === 0 ?
			{
				clientId: req.user._id,
				status: 0
			} :
			{
				vendorId: req.user._id,
				status: 0
			};
		await Dispute.find(query)
			.populate({
				path: "contractId",
				model: "contract",
				populate: {
					path: "job",
					model: "job",
				},
			})
			.populate({
				path: "vendorId",
				model: "user",
			})
			.populate({
				path: "clientId",
				model: "user",
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

	controllers.getClosedDispute = async (req, res) => {
		const query =
			req.user.accountType === 0 ?
			{
				clientId: req.user._id,
				status: 1
			} :
			{
				vendorId: req.user._id,
				status: 1
			};
		await Dispute.find(query)
			.populate({
				path: "contractId",
				model: "contract",
				populate: {
					path: "job",
					model: "job",
				},
			})
			.populate({
				path: "vendorId",
				model: "user",
			})
			.populate({
				path: "clientId",
				model: "user",
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
	return controllers;
};