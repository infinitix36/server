const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");

userRoute.route("/users/getTechLead").get(function (req, res) {
  User.find({ useRoleName: "Techlead" },(err, projects) => {
      if (err) {
        res.send(err);
      } else {
        // const usersArray = projects.map((item) => item.users);
        // res.json(usersArray);
        res.json(projects[0].users);
      }
    }
  );
});

module.exports = userRoute;