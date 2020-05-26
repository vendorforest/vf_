import mongoose from "mongoose";

const MileStoneSchema = new mongoose.Schema({

	contract: {

		type: mongoose.Schema.Types.ObjectId,

		ref: "contract",

		required: true,
	},

	description: {

		type: String,

		required: true,
	},

	price: {

		type: Number,

		required: true,
	},

	status: {

		type: Number,

		default: 0,
	}
}, {

	versionKey: false,

	timestamps: true,
});

MileStoneSchema.post("init", function (doc) {
	
	// env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("milestone", MileStoneSchema);