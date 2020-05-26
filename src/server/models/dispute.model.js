import mongoose from "mongoose";
import { constants } from "@Config/index";
import { string } from "prop-types";

const DisputeSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    title: {
      type: String,
    },
    description: String,
    price: Number,
    time: String,
    queue: {
      type: Number,
      unique: true,
    },
    status: {
      type: Number,
      default: constants.DISPUTE.OPEN,
    },
    contractId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contract",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model("dispute", DisputeSchema);
