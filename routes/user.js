const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");

userRoute.route("/users/getTechLead").get(function (req, res) {
  User.find({ useRoleName: "Techlead" }, (err, projects) => {
    if (err) {
      res.send(err);
    } else {
      // const usersArray = projects.map((item) => item.users);
      // res.json(usersArray);
      res.json(projects[0].users);
    }
  });
});

userRoute.route("/users/getContributors").get(function (req, res) {
  User.find(
    { useRoleName: { $in: ["Developer", "Techlead", "BA"] } },
    (err, projects) => {
      if (err) {
        res.send(err);
      } else {

        var data = projects.map((item) => {
          var eachUserData = item.users.map((userData) => {
            userData["userRoleName"] = item.useRoleName;  // add userRoleName to each user
            return userData;
          });
          return eachUserData;
        });
        res.json([].concat(...data));


      }
    }
  );
});

module.exports = userRoute;
