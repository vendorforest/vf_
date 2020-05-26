import mongoose from "mongoose";
import getEnv, { constants } from "@Config/index";

const OfferSchema = new mongoose.Schema({

	proposal: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "proposal",

		required: true,
	},

	team: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "team",

		required: true,
	},

	receiver: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "user",

		required: true,
	},

	offerBudgetType: {

		type: Number,

		required: true,
	},

	budget: {

		type: Number,

		required: true,
	},

	status: {

		type: Number,

		default: constants.OFFER_STATUS.CREATED,
	}
}, {

	versionKey: false,

	timestamps: true,
} );

OfferSchema.post("init", function (doc) {});

export default mongoose.model("offer", OfferSchema);