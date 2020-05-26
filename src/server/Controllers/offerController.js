import Offer from "@Models/offer.model";
import getEnv, { constants } from "@Config/index";

const env = getEnv();

export default () => {
  const controllers = {};

  controllers.update = async (req, res, next) => {
    await Offer.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      req.body,
      {
        new: true,
      },
    )
      .then((offer) => {
        if (!offer) {
          return res.status(401).json({
            status: 401,
            message:
              env.MODE === "development"
                ? `Offer ${constants.DEV_EMPTYDOC_MSG}`
                : constants.PROD_COMMONERROR_MSG,
          });
        }
        return res.status(200).json({
          status: 200,
          message:
            req.body.status === constants.OFFER_STATUS.ACCEPT
              ? "Offer has been accepted."
              : "Offer has been declined.",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  controllers.getOffers = async (req, res, next) => {
    await Offer.find({
      ...req.query,
    })
      .populate({
        path: "proposal",
        model: "proposal",
        populate: {
          path: "job",
          model: "job",
          populate: {
            path: "client",
            model: "user",
          },
        },
      })
      .then((offers) => {
        return res.status(200).json({
          status: 200,
          data: offers,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  controllers.decline = async (req, res, next) => {
    await Offer.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      {
        status: constants.OFFER_STATUS.DECLINE,
      },
    )
      .then((offer) => {
        if (!offer) {
          return res.status(401).json({
            status: 401,
            message:
              env.MODE === "development"
                ? `Offer ${constants.DEV_EMPTYDOC_MSG}`
                : constants.PROD_COMMONERROR_MSG,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Offer has been delcined.",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  controllers.accept = async (req, res, next) => {
    await Offer.findOneAndUpdate(
      {
        _id: req.body._id,
      },
      {
        status: constants.OFFER_STATUS.ACCEPT,
      },
    )
      .then((offer) => {
        if (!offer) {
          return res.status(401).json({
            status: 401,
            message:
              env.MODE === "development"
                ? `Offer ${constants.DEV_EMPTYDOC_MSG}`
                : constants.PROD_COMMONERROR_MSG,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Offer has been accepted successfully.",
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG,
        });
      });
  };

  controllers.pendingOffers = async (req, res, next) => {
    await Offer.find(req.body)
      .then((offer) => {
        if (!offer) {
          return res.status(401).json({
            status: 401,
            message:
              env.MODE === "development"
                ? `Offer ${constants.DEV_EMPTYDOC_MSG}`
                : constants.PROD_COMMONERROR_MSG,
          });
        }
        return res.status(200).json({
          status: 200,
          message: "Offer has been accepted successfully.",
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
