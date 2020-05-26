import mongoose from "mongoose";
import { constants } from "@Config/index";

const ContractSchema = new mongoose.Schema({

	job: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "job",

		required: true,
	},

	client: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "user",

		required: true,
	},

	proposal: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "proposal",

		required: true,
	},

	vendor: {

		type: mongoose.Schema.Types.ObjectId,

		required: true,

		ref: "user",
	},

	budget: {

		type: Number,

		required: true,
	},

	totalBudget: {

		type: Number,

		required: true,
	},

	paidPrice: {

		type: Number,

		default: 0,
	},

	escrowPrice: {

		type: Number,

		default: 0,
	},

	limitTime: {

		type: Number,
	},

	stDateTime: {

		type: String,

		required: true,
	},

	endDateTime: {

		type: String,

		required: true,
	},

	completedDateTime: {

		type: String,
	},

	reviews: [{

		type: mongoose.Schema.Types.ObjectId,

		ref: "review",
	}],

	completedPercent: {

		type: Number,

		default: 0,
	},

	isCompleted: {

		type: Boolean,

		default: false,
	},

	status: {

		type: Number,

		required: true,

		default: constants.CONTRACT_STATUS.CREATED,
	}
}, {

	versionKey: false,

	timestamps: true,
});

ContractSchema.post("init", function (doc) {
	// env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("contract", ContractSchema);