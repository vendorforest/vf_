import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    user: String,
    roomName: { type: String, unique: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export default mongoose.model("chatRoom", chatRoomSchema);
