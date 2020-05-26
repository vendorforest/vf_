import mongoose from "mongoose";
import { constants } from "@Config/index";

const JobSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },
    subCategories: [
      {
        type: String,
        required: true,
      },
    ],
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    avbHrsPerWeek: {
      type: Number,
      default: 0,
    },
    budgetType: {
      type: Number,
      required: true,
      default: 0,
    },
    budget: {
      type: Number,
      required: true,
    },
    stDateTime: {
      type: String,
      required: true,
    },
    endDateTime: {
      type: String,
      required: true,
    },
    location: {
      _id: false,
      country: String,
      state: String,
      city: String,
      fullAddress: String,
      lat: Number,
      lng: Number,
      placeId: String,
    },
    postRadius: {
      type: Number,
      required: true,
      default: 100.0,
    },
    attachFiles: [
      {
        _id: false,
        name: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    questions: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Number,
      default: 0,
    },
    vendorType: {
      type: Number,
      default: 0,
    },
    invitedVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    ],
    hiredVendors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
      },
    ],
    proposales: [
      {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "proposal",
      },
    ],
    status: {
      type: Number,
      required: true,
      default: constants.JOB_STATUS.POSTED,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

JobSchema.post("init", function(doc) {
  // env.MODE === "development" && console.log("init hook", doc)
});

export default mongoose.model("job", JobSchema);
