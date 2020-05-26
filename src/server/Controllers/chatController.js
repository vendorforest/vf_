import Job from "@Models/job.model";
import User from "@Models/user.model";
import Room from "@Models/chatRoom.model";
import Chat from "@Models/chat.model";
import express from "express";
import getEnv, { constants } from "@Config/index";
import { async } from "q";
const env = getEnv();

const app = express();

export default () => {
  const controllers = {};

  controllers.getConnectedUser = async (req, res) => {
    const myName = req.user.username;
    const staff = req.user.accountType;
    const query = staff === 0 ? { user: myName } : { roomName: myName };
    await Room.find(query)
      .sort({
        createdAt: -1,
      })
      .then(async (connectedUsers) => {
        return res.status(200).json({
          status: 200,
          data: connectedUsers,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message:
            process.env.NODE_ENV === "development"
              ? error.message
              : constants.PROD_COMMONERROR_MSG,
        });
      });
  };
  controllers.getOldMsg = async (req, res) => {
    const clientID = req.body.clientID;
    const myName = req.user.username;
    const query1 = { user: myName, roomID: clientID };
    const query2 = { user: clientID, roomID: myName };
    const query = { $or: [query1, query2] };
    await Chat.find(query)
      .sort({
        createdAt: 1,
      })
      .then(async (oldMsgs) => {
        return res.status(200).json({
          status: 200,
          data: oldMsgs,
        });
      })
      .catch((error) => {
        return res.status(500).json({
          status: 500,
          message:
            process.env.NODE_ENV === "development"
              ? error.message
              : constants.PROD_COMMONERROR_MSG,
        });
      });
  };
  return controllers;
};
