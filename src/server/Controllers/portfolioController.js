import Portfolio from "@Models/portfolio.model";
import User from "@Models/user.model";
import getEnv, { constants } from "@Config/index";
import getCloudinaryCtr from '@Controllers/cloudinary'
import { getInfoFromVideoUrl } from "@Utils/utils";
import fs from 'fs'
const env = getEnv();
const cloudinaryCtr = getCloudinaryCtr();


export default () => {

	const controllers = {};

	controllers.get = async (req, res, next) => {

		await Portfolio.findById(req.query._id).populate("user").then(async (portfolio) => {

			if (!portfolio) {
				
				return res.status(401).json({
					
					status: 401,
					
					message: env.MODE === "development" ? `Portfolio ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG
				});
			}

			return res.status(200).json({ status: 200, data: portfolio });
		}).catch((error) => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		});
	};

	controllers.getMyPortfolios = async (req, res, next) => {

		await Portfolio.find({ user: req.user._id }).populate("user").then(async (portfolios) => {

			return res.status(200).json({ status: 200, data: portfolios });

		}).catch((error) => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		});
	};
	
	controllers.create = async (req, res, next) => {
		try {

			const portfolioDoc = new Portfolio({ user: req.user._id, ...req.body });
			
			await portfolioDoc.save().then(async (portfolio) => {

				await User.findOneAndUpdate( { _id: req.user._id }, { $inc: { profilePercent: 50 } });

				return res.status(200).json({ status: 200, data: portfolio, message: "Portfolio has been created." });
			});

		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.update = async (req, res, next) => {

		await Portfolio.findOneAndUpdate( { _id: req.body._id }, req.body, { new: true } ).then(async (portfolio) => {

			if (!portfolio) {

				return res.status(401).json({

					status: 401,

					message: env.MODE === "development" ? `Portfolio ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG,
				});
			}

			return res.status(200).json({ status: 200, data: portfolio, message: "Portfolio has been updated." });

		}).catch((error) => {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		});
	};

	controllers.uploadImage = async (req, res, next) => {

		try {

			const data = await cloudinaryCtr.upload(req.file, `vendorforest/${req.file.filename}`, next)

			const portfolio = await Portfolio.create({

				user: req.user._id, public_id: data.public_id,

				version: data.version, type: constants.PORTFOLIO_TYPE.IMAGE
			})

			fs.unlink(req.file.path, (result, error) => {})

			return res.status(200).json({ status: 200, data: portfolio })
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.uploadVideo = async (req, res, next) => {

		try {
			
			const videoInfo = getInfoFromVideoUrl(req.body.url)

			if (!videoInfo.videoId) return res.status(500).json({ status: 500, message: 'Invalid Video Url' })
			
			const portfolio = await Portfolio.create({

				user: req.user._id, public_id: videoInfo.videoId,

				video_type: videoInfo.type, type: constants.PORTFOLIO_TYPE.VIDEO,

				url: req.body.url
			})

			return res.status(200).json({ status: 200, data: portfolio })
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	controllers.delete = async (req, res, next) => {

		try {

			Portfolio.findOneAndRemove({_id: req.body._id});

			return res.status(200).json({ status: 200, message: 'Portfolio has been deleted' })
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};

	

	return controllers;
};
