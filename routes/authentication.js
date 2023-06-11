const express = require("express");
const bcrypt = require("bcrypt");
const authRoute = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expTime = "1d";
const sendMail = require("../mail/mailer");

function generateString(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

authRoute
  .route("/authentication/forgotpassword")
  .post(async function (req, res) {
    const email = req.body.email;
    const randomString = generateString(50);
    const forgotPasswordURL = `http://localhost:3000/resetpassword/${email}/${randomString}`;
    console.log(forgotPasswordURL);
    User.findOne({ email: email }, function (err, user) {
      user.forgotPasswordLink = randomString;
      user.save(async (err) => {
        if (err) {
          return res.json({ message: "Reset Password Failed" });
        } else {
          const mailOptions = {
            to: email,
            subject: "Password Reset Link",
            html: `Reset Password Using this link: <a href="${forgotPasswordURL}>click</a>"`,
          };
          const success = await sendMail(mailOptions);
          if (success) {
            return res.json({
              message: "Reset Password link sent to your email",
            });
          } else {
            return res.json({
              message: "Error in Sending Email",
            });
          }
        }
      });
    });
  });

authRoute
  .route("/authentication/resetPassword")
  .post(async function (req, res) {
    const email = req.body.email;
    const string = req.body.string;
    const newPassword = req.body.newPassword;
    console.log(email);
    console.log(string);
    console.log(newPassword);
    User.findOne({ email: email }, function (err, user) {
      if (string == user.forgotPasswordLink) {
        bcrypt.hash(newPassword, 10, function (err, hashedPassword) {
          user.password = hashedPassword;
          user.forgotPasswordLink = "";
          user.save(async (err) => {
            if (err) {
              return res.json({
                status: true,
                message: "Reset Password Failed",
              });
            } else {
              return res.json({
                status: false,
                message: "Password Reset Successfully",
              });
            }
          });
        });
      } else {
        return res.json({
          status: false,
          message: "Invalid Link",
        });
      }
    });
  });

authRoute.route("/authentication/verifyToken").post(async (req, res) => {
  const token = req.body.token;
  jwt.verify(token, "universe", function (err, decoded) {
    if (err) {
      return res.json({
        message: "Token is Invalid or Expired",
        status: false,
        expTime: expTime,
      });
    } else {
      return res.json({
        message: decoded,
        status: true,
        expTime: expTime,
      });
    }
  });
});

authRoute.route("/authentication/register").post(function (req, res) {
  let userRoleName;
  let approveStatus = false;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const email = req.body.email;
  const phone = req.body.phone;
  const orangeHrLink = req.body.orangeHrLink;
  const GitHubUsername = req.body.GitHubUsername;
  const userJiraLink = req.body.userJiraLink;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const commitCount = 0;
  const rating = 0;

  User.countDocuments({}, function (err, count) {
    if (err) {
      return res
        .status(500)
        .send({ error: "Error checking userRoles collection" });
    }

    if (count == 0) {
      // If the count is 0, the userRoles collection is empty
      userRoleName = "admin";
      approveStatus = true;
      console.log("inside loop");
    } else {
      userRoleName = req.body.userRoleName;
    }
    bcrypt.hash(password, 10, function (err, hashedPassword) {
      if (err) {
        return res.status(500).send({ error: "Error hashing password" });
      }
      const user = new User({
        userRoleName: userRoleName,
        fname: fname,
        lname: lname,
        email: email,
        phone: phone,
        orangeHrLink: orangeHrLink,
        GitHubUsername: GitHubUsername,
        userJiraLink: userJiraLink,
        password: hashedPassword,
        commitCount: commitCount,
        rating: rating,
        approveStatus: approveStatus,
        confirmPassword: confirmPassword,
      });

      // Attempt to save the user's data to the database
      user
        .save()
        .then((item) => {
          // If the save is successful, send a JSON response with a success message
          res.json({
            message: "Account Registered Successfully",
            status: true,
          });
        })
        .catch((err) => {
          // If an error occurs during the save process, check if the error code is 11000 (indicating duplicate data)
          if (err.code === 11000) {
            // If the error code is 11000, send a JSON response with a message indicating that the user already exists
            return res.json({ message: "User already exists", status: false });
          }
          // If the error is not a duplicate data error, send a 500 status code and a JSON response with an error message
          res.status(500).send({ error: "Error saving data to the database" });
        });
    });
    const URL = "http://localhost:3000/pending";
    const mailOptions = {
      to: "dreamshack1999@gmail.com",
      subject: "Verify User",
      html: `New user is there check that IN URL : ${URL}`,
    };
    sendMail(mailOptions);
    console.log(count);
  });
  // Hash the password using bcrypt
});

authRoute.route("/authentication/login").post(function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error while retrieving user from database" });
    }

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    if (!user.approveStatus) {
      return res.status(401).send({ message: "User not approved" });
    }

    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        return res
          .status(500)
          .send({ error: "Error while comparing passwords" });
      }

      if (result) {
        const token = jwt.sign({ userData: user }, "universe", {
          expiresIn: expTime,
        });
        return res.json({
          message: "Logged in successfully",
          status: true,
          token: token,
          isAuthenticated: true,
        });
      } else {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
    });
  });
});

module.exports = authRoute;
