import Service from "@Models/service.model";
import User from "@Models/user.model";
import Job from "@Models/job.model";
import getEnv, { constants } from "@Config/index";
import getStripeCtr from '@Controllers/stripe'

const stripeCtr = getStripeCtr();

const env = getEnv();

export default () => {
  const controllers = {};

  controllers.get = async (req, res) => {

    env.MODE === "development" && console.log("req.isAuthenticated() ", req.isAuthenticated());
    try {
      await Service.find({})
        .populate({
          path: "categories",
          model: "category",
        })
        .then(async (serviceResult) => {
          const services = serviceResult;
          await User.find({
            accountType: constants.ACCOUNT_TYPE.VENDOR,
            vendor: {
              $exists: true,
            },
          })
            .populate({
              path: "vendor",
              model: "vendor",
              populate: [
                {
                  path: "service",
                  model: "service",
                },
                {
                  path: "category",
                  model: "category",
                },
              ],
            })
            .lean()
            .sort({
              "vendor.rate": 1,
            })
            .limit(9)
            .then(async (userResult) => {
              const vendors = userResult;
              await Job.find({
                status: 0,
              })
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
                .lean()
                .sort({
                  createdAt: -1,
                })
                .limit(3)
                .then(async (jobResult) => {
                  const jobs = jobResult;
                  return res.status(200).json({
                    status: 200,
                    data: {
                      user: req.user,
                      services: services,
                      vendors: vendors,
                      jobs: jobs,
                    },
                  });
                })
                .catch((error) => console.log(error));
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
      });
    }
  };

  return controllers;
};
