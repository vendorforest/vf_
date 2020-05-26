import { Strategy } from "passport-local";
import User from "@Models/user.model";
import crypto from "crypto";
//const BearerStrategy = require('passport-http-bearer').Strategy;

export function passportConfig(passport) {
  // tell passport how to serialize the user
  passport.serializeUser((user, done) => {
    //user id
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(function(user) {
      if (!user) {
        return done(
          {
            error: "User not found.",
            status: 401,
          },
          null,
        );
      }
      done(null, user);
    });
  });

  // configure passport.js to use the local strategy
  passport.use(
    new Strategy(
      {
        usernameField: "email",
      },
      function(username, userPassword, done) {
        User.findOne({
            email: username,
          },
          function(err, user) {
            if (err) {
              return res.status(500).send({
                status: 500,
                msg: err.message,
              });
            }
            if (!user) {
              return done(
                {
                  status: 400,
                  type: "not-found",
                  msg: "We were unable to find a user with these credentials.",
                },
                null,
              );
            }

            user.verifyPassword(userPassword, function(err, isMatch) {
              if (err) {
                return done(
                  {
                    status: 401,
                    type: err.name,
                    msg: err.message,
                  },
                  null,
                );
              }
              if (!isMatch) {
                return done(
                  {
                    status: 401,
                    type: `Credential Error`,
                    msg: "Invalid email or password",
                  },
                  null,
                );
              }
              // Make sure the user has been verified
              if (!user.isVerified) {
                return done(
                  {
                    status: 401,
                    type: "not-verified",
                    msg: "Your account has not been verified.",
                  },
                  null,
                );
              }

              done(
                null,
                Object.assign(
                  {
                    token: crypto.randomBytes(16).toString("hex"),
                  },
                  {
                    userObj: user,
                  },
                ),
              );
            });
          },
        );
      },
    ),
  );
}
