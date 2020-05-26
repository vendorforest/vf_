import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    user: String,
    roomID: String,
    msg: String,
    time: String,
    avatarUrl: String,
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model("chat", ChatSchema);
