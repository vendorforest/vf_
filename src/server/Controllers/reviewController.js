// @ts-nocheck
import Review from "@Models/review.model";
import Contract from "@Models/contract.model";
import Vendor from "@Models/vendor.model";
import Client from "@Models/client.model";
import getEnv, {
	constants
} from "@Config/index";
const env = getEnv();

export default () => {

	const controllers = {};

	controllers.get = async (req, res, next) => {
		
		await Review.findById(req.query._id)
			.populate({
				path: "contract",
				model: "contract",
				populate: {
					path: "job",
					model: "job",
					select: {
						budgetType: 1,
						budget: 1,
						title: 1,
					},
				},
			})
			.populate("from")
			.populate("to")
			.then(async (reviews) => {
				return res.status(200).json({
					status: 200,
					data: reviews,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getReviews = async (req, res, next) => {
		await Review.find(req.query)
			.populate({
				path: "contract",
				model: "contract",
				populate: {
					path: "job",
					model: "job",
					select: {
						budgetType: 1,
						budget: 1,
						title: 1,
					},
				},
			})
			.populate("from")
			.populate("to")
			.then(async (reviews) => {
				return res.status(200).json({
					status: 200,
					data: reviews,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.getMyReviews = async (req, res, next) => {
		await Review.find({
				to: req.user._id,
			})
			.populate({
				path: "contract",
				model: "contract",
				populate: {
					path: "job",
					model: "job",
					select: {
						budgetType: 1,
						budget: 1,
						title: 1,
					},
				},
			})
			.populate("from")
			.populate("to")
			.then(async (reviews) => {
				return res.status(200).json({
					status: 200,
					data: reviews,
				});
			})
			.catch((error) => {
				return res.status(500).json({
					status: 500,
					message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
				});
			});
	};

	controllers.create = async (req, res, next) => {

		try {

			let review = await Review.findOne({ contract: req.body.contract, from: req.body.from })

			if (review) return res.status(400).json({ status: 400, message: "You left feedback already." });

			const contract = await Contract.findOne({ _id: req.body.contract }) 

				.populate({ path: "client", model: "user", 

					populate: { path: "client", model: "client" }})

				.populate({ path: "vendor", model: "user",

					populate: { path: "vendor", model: "vendor" }
			});
						
			if (!req.body.to) req.body.to = String(contract.client._id) === String(req.body.from) ? contract.vendor._id : contract.client._id;

			review = await Review.create(req.body);

			if (req.body.from === String(contract.client._id)){

				const vendor = contract.vendor.vendor;

				const rate = Math.ceil((vendor.rate * vendor.reviewCount + req.body.rate) * 10 / (vendor.reviewCount + 1)) / 10

				await Vendor.findOneAndUpdate({ _id: vendor._id }, {rate: rate, $inc: { reviewCount: 1 }})

				await Contract.findOneAndUpdate({ _id: contract._id}, { $push: { reviews: review._id }});

			} else if (req.body.from === String(contract.vendor._id)){

				const client = contract.client.client;

				const rate = Math.ceil((client.rate * client.reviewCount + req.body.rate) * 10 / (client.reviewCount + 1)) / 10

				await Client.findOneAndUpdate({ _id: client._id }, {rate: rate, $inc: { reviewCount: 1 }})

				await Contract.findOneAndUpdate({ _id: contract._id}, { $push: { reviews: review._id }});
			}

			return res.status(200).json({ status: 200, data: review, message: "Feedback success." });
						
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG});
		}
	};

	controllers.update = async (req, res, next) => {
		await Review.findOneAndUpdate({
					_id: req.body._id,
					from: req.user._id,
				},
				req.body, {
					new: true,
				},
			)
			.then(async (review) => {
				if (!review) {
					return res.status(401).json({
						status: 401,
						message: env.NODE_ENV === "development" ?
							`Review ${constants.DEV_EMPTYDOC_MSG}` :
							constants.PROD_COMMONERROR_MSG,
					});
				}
				return res.status(200).json({
					status: 200,
					data: review,
					message: "Review has been updated.",
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