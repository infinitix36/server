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
  const fname = req.body.fname;
  const email = req.body.email;
  const userGitHubLink = req.body.githubLink;
  const password = req.body.password;
  const useRoleName=req.body.useRoleName;

  // Hash the password using bcrypt
  bcrypt.hash(password, 10, function (err, hashedPassword) {
    if (err) {
      return res.status(500).send({ error: "Error hashing password" });
    }

    const user = new User({
      fname,
      email,
      userGitHubLink,
      password: hashedPassword,
      useRoleName,
    });

    user
      .save()
      .then((item) =>
        res.json({ message: "Account Registered Successfully", status: true })
      )
      .catch((err) => {
        if (err.code === 11000) {
          return res.json({ message: "User already exists", status: false });
        }
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
        });
      } else {
        return res.status(401).send({ message: "Incorrect email or password" });
      }
    });
  });
});

module.exports = authRoute;
