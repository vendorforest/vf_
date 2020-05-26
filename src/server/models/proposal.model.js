import mongoose from "mongoose";
import getEnv, { constants } from "@Config/index";

const ProposalSchema = new mongoose.Schema({

	job: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "job",

		required: true,
	},

	vendor: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "user",

		required: true,
	},

	offerBudget: {

		type: Number,

		required: true,
	},

	offerBudgetType: {

		type: Number,

		required: true,
	},

	bidType: {

		type: Number,

		required: true,

		default: constants.BID_TYPE.INDIVIDUAL,
	},

	offers: [{

		type: mongoose.Schema.Types.ObjectId,

		ref: "offer",

		required: true,
	}, ],

	answers: [{

		_id: false,

		question: {

			type: String,
		},

		answer: {

			type: String,
		},
	}, ],

	status: {

		type: Number,

		default: constants.PROPOSAL_STATUS.CREATED,
	},
}, {

	versionKey: false,
	
	timestamps: true,
}, );

ProposalSchema.post("init", function (doc) {
	// env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("proposal", ProposalSchema);