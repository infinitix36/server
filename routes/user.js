const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");

userRoute.route("/users/addRate").post(async (req, res) => {
  const rating = {
    rating: req.body.rating,
  };
  Project.updateOne(
    { lname: req.body.lname },
    {
      $set: {
        rating: rating,
      },
    }
  )
    .then((result) => {
      return res.json({
        message: "rated successfully",
        status: true,
      });
    })
    .catch((err) => {
      return res.json({
        message: "Error in rating",
        status: false,
      });
    });
});

userRoute.route("/users/getFind").get(function (req, res) {
  User.find({ fname: { $in: ["kama"] } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});
userRoute.route("/users/getBA").get(function (req, res) {
  User.find({ useRoleName: { $in: ["BA"] } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});
userRoute.route("/users/getQA").get(function (req, res) {
  User.find({ useRoleName: { $in: ["QA"] } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

userRoute.route("/users/getDeveloper").get(function (req, res) {
  User.find({ useRoleName: { $in: ["Developer"] } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

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
    { useRoleName: { $in: ["Developer", "TeahLead", "BA"] } },
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

module.exports = userRoute;
