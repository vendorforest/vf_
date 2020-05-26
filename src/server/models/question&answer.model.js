import mongoose from "mongoose";
import { constants } from "@Config/index";
import { string } from "prop-types";

const QuestionAnswerSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    question: {
      type: String,
    },
    answer: {
      type: String,
    },
    status: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model("question&answer", QuestionAnswerSchema);
