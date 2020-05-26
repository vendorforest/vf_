import mongoose from "mongoose";

const Schema = mongoose.Schema;
const tokenSchema = new Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  email: {
    type: String,
    required: true,
    ref: "user",
  },
  token: {
    type: String,
  },
  code: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: "300s",
  },
});

export default mongoose.model("token", tokenSchema);
