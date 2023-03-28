const express = require("express");
const bcrypt = require("bcrypt");
const authRoute = express.Router();
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expTime = "1m";
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

  const userRoleName = req.body.userRoleName;
  const fname = req.body.fname;
  const lname = req.body.lname;

  const email = req.body.email;
  const phone = req.body.phone;
  const orangechangeHrLink = req.body.orangechangeHrLink;
  const GitHubUsername = req.body.GitHubUsername;

  const userJiraLink = req.body.userJiraLink;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;



    


  // Hash the password using bcrypt
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
      orangechangeHrLink: orangechangeHrLink,
      GitHubUsername: GitHubUsername,
      userJiraLink: userJiraLink,
      password: hashedPassword,

      confirmPassword: confirmPassword,
      
        

    });

    // Attempt to save the user's data to the database
    user
      .save()
      .then((item) => {
        // If the save is successful, send a JSON response with a success message
        res.json({ message: "Account Registered Successfully", status: true });
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
});

authRoute.route("/authentication/login").post(function (req, res) {
  const email = req.body.email;
  const password = req.body.password;
  

  

  User.findOne({ email: email }, function (err, user) {
    if (err) {
      return res
        .status(500)
        .send({ error: "Error while retrieving user from database" });
    }

    if (!user) {
      return res.status(404).send({ error: "User not found" });
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
          isAuthenticated: true
          

        });
      } else {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
    });
  });
});

module.exports = authRoute;
