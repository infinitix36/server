const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");

userRoute.route("/users/getTechLead").get(function (req, res) {
  User.find(
    { useRoleName: "TeahLead" },
    { fname: 1, lname: 1 },
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        // const usersArray = projects.map((item) => item.users);
        // res.json(usersArray);
        res.json(users);
      }
    }
  );
});

userRoute.route("/users/getContributors").get(function (req, res) {
  User.find(
    { useRoleName: { $in: ["Developer", "QA", "BA"] } },
    { fname: 1, lname: 1 },
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        var convertArray = users.map((item) => {
          return { value: item._id, label: item.fname + " " + item.lname };
        });
        res.json(convertArray);
      }
    }
  );
});

userRoute.route("/users").get(function (req, res) {
  userQuery = req.query.roleName ? {useRoleName: req.query.roleName} : {}
  sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
  User.find(
    userQuery,
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  ).sort(sortQuery);
});

module.exports = userRoute;
