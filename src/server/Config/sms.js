import getEnv, { constants } from "@Config/index";
const twilio = require("twilio");
const env = getEnv();


export default function sendingSms(phone, title, description) {
    const accountSid = env.TWILIO_ACCOUNT_SID;
    const authToken = env.TWILIO_AUTH_TOKEN;
    const from = env.SERVER_TWILIO_NUMBER;
    const client = twilio(accountSid, authToken);
    try {
      client.messages
        .create({
          to: phone,
          from: from,
          body: `${title} \n ${description}`,
        })
        .then((message) => env.MODE === "development" && console.log(message.sid));
      env.MODE === "development" && console.log("end");
    } catch (error) {
      env.MODE === "development" && console.log(error);
    }
  };