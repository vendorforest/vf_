import Service from "@Models/service.model";
import Category from "@Models/category.model";
import User from "@Models/user.model";
import getEnv, { constants } from "@Config/index";

const env = getEnv();

export default () => {
  const controllers = {};

  controllers.getServices = async (req, res, next) => {
    await Service.find({})
      .populate("categories")
      .then(async (services) => {
        return res.status(200).json({
          status: 200,
          data: services,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message:
            env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  controllers.create = async (req, res, next) => {
    try {
      let categoryPromise = req.body.categories.map((category) => {
        return Category.create(category);
      });
      const categories = await Promise.all(categoryPromise);
      const service = await Service.create({
        name: req.body.name,
        categories: categories.map((category) => category._id),
      });
      res.status(200).json({
        status: 200,
        data: service,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message:
          env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
      });
    }
  };

  controllers.updateCategory = async (req, res, next) => {
    await Category.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      req.body,
      {
        new: true,
      },
    )
      .then(async (category) => {
        if (!category) {
          return res.status(401).json({
            status: 401,
            message:
              env.NODE_ENV === "development"
                ? `Category ${constants.DEV_EMPTYDOC_MSG}`
                : constants.PROD_COMMONERROR_MSG,
          });
        }
        return res.status(200).json({
          status: 200,
          data: category,
          message: "Service has been saved.",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message:
            env.NODE_ENV === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  return controllers;
};
