import crypto from "crypto";
//import passport from'passport';
import User from "@Models/user.model";
import Token from "@Models/token.model";
import Client from "@Models/client.model";
import Vendor from "@Models/vendor.model";
import {mail} from "@Config/mail";
import geoip from "geoip-lite";
import getEnv, { constants} from "@Config/index";
import mongoose from "mongoose";
import { generate } from "generate-password";
import Notification from "@Models/notification.model";
import getCloudinaryCtr from '@Controllers/cloudinary'
import getStripeCtr from '@Controllers/stripe'
import bcrypt from "mongoose-bcrypt";
import fs from 'fs'

const cloudinaryCtr = getCloudinaryCtr();
const stripeCtr = getStripeCtr();

const Schema = mongoose.Schema;

const restPasswordSchema = new Schema({

    uuid: {

        type: mongoose.Schema.Types.ObjectId,

        required: true,

        ref: "user",
    },

    token: {

        type: String,
    },

    email: {

        type: String,

        required: true,

        ref: "user",
    },

    resetPassword: {

        type: String,
        // bcrypt: true,
    },

    createdAt: {

        type: Date,

        required: true,

        default: Date.now,

        expires: "300s",
    },
});

restPasswordSchema.plugin(bcrypt, { rounds: 8 });

const ResetPassword = mongoose.model("resetPassword", restPasswordSchema);

const getIp = require("ipware")().get_ip;

const env = getEnv();

export default function (passport) {

    const controllers = {};
    
    controllers.getAllUsers = function (req, res) {

        let query = User.find({});

        query.exec((err, users) => {

            if (err) return res.json(err);

            return res.json({ users: users });
        });
    };

    //deactivate not delete
    controllers.deActivateUser = function () {};

    controllers.login = function (req, res, next) {

        try {

            const ipInfo = getIp(req);

            const geo = geoip.lookup(ipInfo.clientIp);

            if (!req.isAuthenticated()) {

                passport.authenticate("local", (err, userObject) => {

                    if (err) return res.status(401).send(err);

                    if (!userObject) return res.status(401).send({ msg: "Error occured" });

                    req.login(userObject.userObj, (err) => {

                        if (err) return res.status(401).send(err);

                        return res.status(200).send(Object.assign({}, { userLocale: geo}, userObject));
                    });

                })(req, res, next);

            } else return next();

        } catch (e) {env.MODE === "development" && console.log("Errror: ", e) }
    };


    //first
    controllers.sendResetPasswordEmail = async (req, res) => {

        const userEmail = req.body.userEmail;

        const subject = "Reset Password is required";

        await User.findOne({ email: userEmail }).then(function (user) {
            
            if (!user) return res.status(404).json({ status: 404, message: "no record match that request!"});

            const token = new Token({ _userId: user._id, email: user.email, token: crypto.randomBytes(16).toString("hex") });

            token.save(function (err, token) {

                if (err) {

                    env.MODE === "development" && console.log("TOKEN Reset Email: ", err);

                    return res.status(500).json({ status: 500, msg: err.message });
                }

                const temporaryPass = generate({ length: 10, numbers: true });

                const newResetPassword = new ResetPassword({ uuid: token._userId, email: token.email, resetPassword: temporaryPass, token: token.token });

                newResetPassword.save(function (err, doc) {

                    if (err) return res.status(404).json({ status: 404, message: "something went wrong while re setting password!" });

                    mail.sendResetPasswordEmail(doc, subject, (err, msg) => {

                        if (err)  return res.status(404).json({ status: 404, message: err.message });

                        return res.status(200).json({ status: 200, message: "Temporary password has been sent to your email successfully.",});
                    });
                });
            });
        }).catch((err) => {

            return res.status(404).json({ status: 404, message: err.message });
        });
    };


    //before you chage password
    controllers.autheticate = async function (req, res) {

        console.log("**********auth********", req.params.token);

        await Token.findOne({ token: req.params.token }).then(async (token) => {

            if (!token) return res.status(402).send({ status: 402, message: "We were unable to find token. This token may have expired. Please try" });

            if (token.token !== req.params.token) return res.status(402).send({ status: 402, message: "Invalid verification code" });

            await ResetPassword.findOne({ uuid: token._userId, email: token.email}).then(async function (user) {

                if (!user) return res.status(404).status({ status: 404, message: "no reset found!"});
                
                await User.findOneAndUpdate({_id: user.uuid}, { $set: { password: user.resetPassword }}).then(function (doc) {

                    if (!doc) return res.status(404).status({ status: 404, message: "no reset found!" });

                    return res.status(200).json({ status: 200, message: "verified" });
                    
                }).catch((error) => {

                    return res.status(500).json({ status: 401, message: "password reset failed level 1 " + error.message });
                });

            }).catch((error) =>{

                return res.status(500).json({status: 401, message: "password reset failed level 1 " + error.message})
            });

        }).catch((error) => {

            env.MODE === "development" && console.log(error);

            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
        });
    };
    

    // after link is authenticated
    controllers.forgotPassword = async (req, res) => {

        console.log("******** forgotPassword", req.body);

        await ResetPassword.findOne({ resetPassword: req.body.oldPass }).then(async function (user) {

            if (!user) return res.status(401).send("user not found");

            await User.findOne({ _id: user.uuid }).then(async (user) => {

                if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });

                await user.verifyPassword(req.body.oldPass).then(async (isMatch) => {

                        if (!isMatch) return res.status(403).json({ status: 400, message: "Invalid old password" });

                        await User.findOneAndUpdate({ _id: req.user._id }, { $set: { password: req.body.newPass }}).then(async () => {

                            return res.status(200).json({ status: 200, message: "Passward has been reset" });

                        }).catch((error) => {

                            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
                        });
                    }).catch((error) => {

                        return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG, });
                    });

            }).catch((error) => {

                return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
            });

        }).catch((error) => {

            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG, });
        });
    };


    controllers.comparePW = async (req, res) => {

        await User.findOne({ _id: req.user._id }).then(async (user) => {

            if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });
            
            await user.verifyPassword(req.body.password).then(async (isMatch) => {

                if (!isMatch) return res.status(403).json({ status: 400, message: "Your Password is not matched. Please try again." });

                return res.status(200).json({ status: 200, message: "Password Matched!" });

            }).catch((error) => {

                return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
            });
        }).catch((error) => {

            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
        });
    };


    controllers.getUser = async (req, res) => {

        await User.findById(req.user._id).populate({ path: "vendor" }).populate({path: "client"}).then(async (user) => {

            if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });
            
            return res.status(200).json({ status: 200, data: user });

        }).catch((error) => {

            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
        });
    };


    controllers.register = async function (req, res) {

        const userData = {

            email: req.body.email, username: req.body.username, password: req.body.password, accountType: req.body.accountType
        };

        //use schema.create to insert data into the db
        const newUser = new User(userData);

        await newUser.save(async function (err, user) {

            if (err) return res.status(500).json({ status: 500, type: err.name, msg: err.message, errors: err.errors });

            // Create a verification token for this user
            const token = new Token({ _userId: user._id, email: user.email, token: crypto.randomBytes(16).toString("hex")});
            
            await token.save(function (err) {
                
                if (err) {

                    env.MODE === "development" && console.log("TOKEN ERR: ", err);

                    return res.status(500).json({ status: 500, msg: err.message });
                }

                return res.status(200).json({ status: 200, id: user._id, msg: "A verification email has been sent to " + user.email + "." });

                mail.welcome(user, token.token, (err, message) => {

                    if (err) {

                        env.MODE === "development" && console.log("email failed to send: ", err);

                        return res.status(424).json({ status: 424, msg: err.message });
                    }
                });
               
            });
        });
    };


    controllers.emailSent = async (req, res) => {

        await User.findById(req.params.id).then(async (user) => {
                
            if (!user) return res.status(401).json({ status: 401, message: "User doens't exist. Please register again." });

            if (user && user.isVerified) return res.status(402).json({ status: 402, message: "You has been verified already. Please login" });

                await Token.findOneAndUpdate({ _userId: user._id }, { 
                    
                    _userId: user._id, email: user.email, token: crypto.randomBytes(16).toString("hex") 

                }, { upsert: true, new: true } ).then( token => {

                    mail.welcome(user, token.token, (err, message) => {

                        if (err) {

                            env.MODE === "development" && console.log("email failed to send: ", err);

                            return res.status(424).json({ status: 424, msg: err.message });
                        }

                        return res.status(200).json({ status: 200, id: user._id, msg: "A verification email has been sent to " + user.email + "." });
                    })
                });
            },
        );
    };


    controllers.sendCodeEmail = async (req, res) => {

        await User.findOne({ email: req.params.email }).then(async user => {
                
            if (user) return res.status(401).json({ status: 401, message: "This email has been used by another account." });

            const verifyCode = Math.floor(Math.random() * 8999) + 1000;

            env.MODE === "development" && console.log(verifyCode);

            await Token.findOneAndUpdate({ _userId: req.user._id }, { 
                
                _userId: req.user._id, email: req.params.email, code: verifyCode,

            }, { upsert: true, new: true });

            return res.status(200).json({ status: 200, message: "A verification code has been sent to " + req.params.email + "." });
        });
    };


    controllers.userInfo = async (req, res) => {

        await User.findOne({ _id: req.user._id }).populate({ path: "vendor", model: "vendor" }).then((result) => {

            return res.status(200).send({ status: 200, body: result });

        }).catch((error) => {

            return res.status(500).json({ status: 500, message: error.message });
        });
    };


    controllers.clientInfo = async (req, res) => {

        await User.findOne({ _id: req.user._id }).then((result) => {

            return res.status(200).send({ status: 200, data: result });

        }).catch((error) => {

            return res.status(500).json({ status: 500, message: error.message});
        });
    };


    controllers.confirmationPost = async (req, res) => {

        // Find a matching token
        await Token.findOne({ token: req.params.token }).then( token => {
                
            if (!token)  return res.status(402).send({ status: 402, message: "We were unable to find a valid token. Your token may have expired. Please login" });

                // If we found a token, find a matching user

            User.findOne({ _id: token._userId }).then(async user => {
                        
                if (!user) return res.status(401).send({ status: 401, message: "User doesn't exist. Please register again.", });
                
                // Verify and save the user
                await Token.findOneAndRemove({ _id: token._id });

                let updateData = { isVerified: true, isConfirmed: true };

                if (user.accountType === constants.ACCOUNT_TYPE.CLIENT) {

                    const client = new Client({ _id: new mongoose.Types.ObjectId()});
                    
                    client.save();

                    updateData.client = client._id;

                    User.findOneAndUpdate({ _id: user._id }, updateData).then( user => {
                            
                        return res.status(200).send({ status: 200 });
                    });

                } else if (user.accountType === constants.ACCOUNT_TYPE.VENDOR) {

                    const stripeAccount = await stripeCtr.createAccount(user.email);

                    const vendor = new Vendor({ _id: new mongoose.Types.ObjectId(), connectedAccountId: stripeAccount.id });

                    vendor.save();

                    updateData.vendor = vendor._id;

                    User.findOneAndUpdate({ _id: user._id }, updateData).then( user => {

                        return res.status(200).send({ status: 200 });
                    });
                }
            });
        });     
    };


    controllers.updateAccount = (req, res) => {

        if (req.body.verifyCode) {

            Token.findOne({ email: req.body.email }).then(async (token) => {

                if (!token) return res.status(402).send({ status: 402, message: "We were unable to find a valid code. Your code may have expired. Please verify again" });

                if (token.code !== req.body.verifyCode) return res.status(402).send({ status: 402, message: "Invalid veryfy code" });

            }).catch((error) => {

                env.MODE === "development" && console.log(error);

                return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
            });
        }

        User.findOneAndUpdate({ _id: req.user._id }, req.body, { new: true }).populate("client") .populate({ path: "vendor", model: "vendor",

            populate: { path: "company", model: "company" },

        }).then(async (user) => {

            if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG, });

            return res.status(200).json({ status: 200, data: user, message: "Account has been updated." });

        }).catch((error) => {
            
            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
        });
    };


    controllers.resetPass = async (req, res) => {

        await User.findById({ _id: req.user._id }).then(async (user) => {

            if (!user) return res.status(401).json({ status: 401, message: env.MODE === "development" ? `User ${constants.DEV_EMPTYDOC_MSG}` : constants.PROD_COMMONERROR_MSG });

            await user.verifyPassword(req.body.oldPass).then(async (isMatch) => {

                if (!isMatch) return res.status(403).json({ status: 400, message: "Invalid old password" });

                await User.findOneAndUpdate({_id: req.user._id }, { $set: { password: req.body.newPass }}).then(async () => {

                    return res.status(200).json({ status: 200, message: "Passward has been reset" });

                }).catch((error) => { throw new Error(error.message) });
                
            }).catch((error) => { throw new Error(error.message) });

        }).catch((error) => {
            
            return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
        });
    };


    controllers.getNavNotifications = async (req, res) => {

        const user = req.user._id;

        const query = { username: user, status: 0 };

        await Notification.find(query).sort({ createdAt: -1 }).limit(8).then((result) => {

            return res.status(200).json({ result: result });

        }).catch((err) => env.MODE === "development" && console.log("err = ", err));
    };


    controllers.checkNotification = async (req, res) => {

        await Notification.findOneAndUpdate({ _id: req.body.id }, { isRead: true }, { new: true }).then((result) => {

                return res.status(200).json({ result: result });

        }).catch((err) => env.MODE === "development" && console.log("err = ", err));
    };


    controllers.getBadge = async (req, res) => {

        const query = { username: req.user._id, isRead: false, status: 0 };

        await Notification.find(query).then((result) => {

            const count = result.length;

            return res.status(200).json({ length: count });

        }).catch((err) => env.MODE === "development" && console.log("err = ", err));
    };


    controllers.uploadPhoto = async (req, res, next) => {

		try {

            const data = await cloudinaryCtr.upload(req.file, `vendorforest/${req.file.filename}`, next)

            const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v${data.version}/${data.public_id}`

            await User.findOneAndUpdate({_id: req.user._id}, {profileImage: url})

            fs.unlink(req.file.path, (result, error) => {})

			return res.status(200).json({ status: 200, data: url })
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
    };
    

    controllers.uploadStripeFile = async (req, res) => {
		
		try {

            const file = fs.readFileSync(req.file.path);

			const stripeFile = await stripeCtr.createFile({file: file, name: req.file.fileName});

			fs.unlink(req.file.path, (result, error) => {})

			return res.status(200).json({ status: 200, data: stripeFile.id })
			
		} catch (error) {

			return res.status(500).json({ status: 500, message: env.MODE === "development" ? error.message : constants.PROD_COMMONERROR_MSG });
		}
	};



    return controllers;
}