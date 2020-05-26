import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import util from "util";
import Styliner from "styliner";
import os from "os";
import getEnv, { constants } from "@Config/index";

import { OAuth2Client } from "google-auth-library";

const readFile = util.promisify(fs.readFile);
// const OAuth2 = google.auth.OAuth2;
const env = getEnv();

const mailService = () => {
  const oauth = {
    user: env.SUPPORT_EMAIL,
    client_id: env.OAUTH_CLIENT_ID,
    client_secret: env.OAUTH_SECRET,
    accessToken: env.OAUTH_TOKEN,
    scope: env.OAUTH_SCOPE,
    tokenType: "Bearer",
    expiresIn: 3600,
    refresh_token: env.OAUTH_REFRESH_TOKEN,
  };
  const mailObject = {};
  const hostname = os.hostname();

  env.MODE === "production" && console.log("production hostname: ", hostname);

  const clientFile = "email_client_welcome.html";
  const vendorFile = "email_vendor_welcome.html";

  const baseDir = "./public";
  const uncDrive = "\\\\" + hostname + "\\DevTC";
  const uncPath = baseDir.replace(/.*DevTC/gi, uncDrive);
  // If modifying these scopes, delete token.json.
  const SCOPES = ["https://mail.google.com/"];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = "token.json";

  const oauth2Client = new OAuth2Client(
    {
      clientId: oauth.client_id,
      clientSecret: oauth.client_secret,
      redirectUri: "https://vendorforest.com",
    }, // Redirect URL
  );

  let transporter;

  // prependUNCPath is a function called by Styliner for every
  // link that is found in the HTML.
  function prependUNCPath(path, type) {
    return uncPath + path;
  }

  async function read(filePath) {
    const content = await readFile(path.resolve(baseDir, filePath), "utf8");
    return content;
  }

  let styliner = new Styliner(baseDir, {
    url: prependUNCPath,
    noCSS: true,
  });

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param oAuth2Client The OAuth2 client to get token for.
   * @param  callback The callback for the authorized client.
   */
  const getNewToken = (oAuth2Client, callback) => {
    try {
      oauth2Client.setCredentials({
        refresh_token: oauth.refresh_token,
      });

      oAuth2Client
        .getRequestHeaders()
        .then((accessToken) => {
          callback(accessToken);
        })
        .catch((e) => env.MODE === "development" && console.log(e));
    } catch (err) {
      console.error(err);
    }
  };

  const getMailOptions = (user, mailHeader) => {
    const mailOptions = {
      from: `${oauth.user}`, // sender address
      to: `${user.email}`, // list of receivers
      //generateTextFromHTML: true,
      subject: "", // Subject line
      html: "",
    };
    if (mailHeader) {
      mailOptions.subject = mailHeader.subject;
      mailOptions.html = mailHeader.html;
    }
    return mailOptions;
  };

  const sendEmail = (user, fileName, mailHeader, callback) => {
    const mailOptions = getMailOptions(user, mailHeader);
    //console.log(mailOptions);
    const emailTransporter = (accessToken) => {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: oauth.user,
          clientId: oauth.client_id,
          clientSecret: oauth.client_secret,
          refreshToken: oauth.refresh_token,
          accessToken: accessToken,
        },
      });
      read(fileName)
        .then((data) => {
          styliner
            .processHTML(data)
            .then(async (source) => {
              const userNamePattern = /{user}/i;
              const urlPattern = /{url}/i;
              const temporaryPassPattern = /{resetPassword}/i;
              const disputeVendor = /{disputeVendor}/i;
              const disputeClient = /{disputeClient}/i;
              const title = /{title}/i;
              const description = /{description}/i;
              const href = mailHeader.href;
              const client = /{client}/i;
              const budget = /{budget}/i;
              const created = /{created}/i;
              const teamName = /{teamName}/i;

              if (href) {
                source = source.replace(
                  urlPattern,
                  `<a href=${href} target="_blank">${href}</a>`,
                );
              }
              //console.log(user);
              if (user) {
                source = !user.username
                  ? source.replace(userNamePattern, user.firstName ? user.firstName:user.email)
                  : source.replace(userNamePattern, user.username);
                source = source.replace(temporaryPassPattern, user.resetPassword);
                source = source.replace(disputeVendor, user.vendorId? user.vendorId.username:"");
                source = source.replace(disputeClient,user.clientId? user.clientId.username:"");
                source = source.replace(title, user.title);
                source = source.replace(description, user.description);
                source = source.replace(client, user.client);
                source = source.replace(budget, user.budget);
                source = source.replace(created, user.created);
                source = source.replace(teamName, user.teamName);
              }

              mailOptions.html = source;

              // send mail with defined transport object
              await transporter.sendMail(mailOptions, (error, response) => {
                if (error) {
                  callback(error, error.message);
                }
                transporter.close();
                callback(undefined, "email sent");
              });

              // That last brace is to close off async function
            })
            .catch((e) => callback(e, e.message));
        })
        .catch((e) => callback(e, e.message));
    };
    try {
      getNewToken(oauth2Client, emailTransporter);
    } catch (e) {
      callback(e, e.message);
    }
  };

  mailObject.sendResetPasswordEmail = async (user, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      href: `${env.API_URL}/reset/${user.token}`,
    };
    // console.log(mailOptions);
    // console.log(mailObject); 
    //console.log(user);
    sendEmail(user, "email_template.html", mailOptions, callback);
  };

  mailObject.welcome = async (user, token, callback) => {
    const fileName =
      user.accountType === constants.ACCOUNT_TYPE.CLIENT ? clientFile : vendorFile;
    const mailHeader = {
      href: `${env.API_URL}/confirmation/${token}`,
      subject: "Welcome to VendorForest!",
    };
    sendEmail(user, fileName, mailHeader, callback);
    // setup e-mail data with unicode symbols
  };
  
  mailObject.sendVendorHireByClientEmail = async (hire, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      href: `${env.API_URL}/vendor/contract/${hire.contractId}`,
    };

    sendEmail(hire, "email_hire.html", mailOptions, callback);
    console.log("sent email = ", hire);
  };

  mailObject.sendDisputeEmail = async (dispute, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      href: `${env.API_URL}/vendor/contract/${dispute.contractId}`,
    };

    sendEmail(dispute, "email_dispute_issue.html", mailOptions, callback);
    console.log("sent email");
  };

  mailObject.sendVendorEmail = async (job, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(job, "email_invite.html", mailOptions, callback);
    console.log("sent email");
  };
  
  mailObject.sendVendorJobPostedEmail = async (job, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(job, "email_new_jobs_arround_area.html", mailOptions, callback);
    console.log("sent email");
  };
  
  mailObject.sendTeamWorkingInviteEmail = async (workingInvite, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(workingInvite, "email_team_invite.html", mailOptions, callback);
    console.log("sent email");
  };

  mailObject.sendJobCompletedEmail = async (jobCompleted, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(jobCompleted, "email_job_completed.html", mailOptions, callback);
    console.log("sent email");
  };
  
  mailObject.sendInvitingEmail = async (invitingEmail, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(invitingEmail, "email_join_team_invite.html", mailOptions, callback);
    console.log("sent email");
  };

  mailObject.sendCreateMilestoneEmail = async (milestone, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(milestone, "email_payment_request.html", mailOptions, callback);
    console.log("sent email");
  };
  mailObject.sendReleaseMilestoneEmail = async (milestone, subject, callback) => {
    const mailOptions = {
      subject: subject, // Subject line
      //href: `${env.API_URL}/reset/${user.token}`,
    };

    sendEmail(milestone, "email_payment_completed.html", mailOptions, callback);
    console.log("sent email");
  };
  return mailObject;
};

export const mail = mailService();
