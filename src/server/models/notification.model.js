import mongoose from "mongoose";
import { constants } from "@Config/index";

const NotificationSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
    },
    proposalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "proposal",
    },
    notificationMsg: String,
    time: String,
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: Number,
      default: constants.NOTIFICATION_STATUS.CREATED,
    },
    urlId: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model("notification", NotificationSchema);
