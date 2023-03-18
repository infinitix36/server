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


// userRoute.route("/users").get(function (req, res) {
  // userQuery = req.query.roleName ? {useRoleName: req.query.roleName} : {}
  // sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
  // User.find(
  //   userQuery,
  //   (err, users) => {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       res.json(users);
  //     }
  //   }
  // ).sort(sortQuery);
// });

userRoute.route("/user/alphabet").get(function (req, res) {
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

// userRoute.route("/user/commits").get(async function (req, res) {
//   userQuery = req.query.roleName ? {useRoleName: req.query.roleName} : {}

//   const owner = req.query.owner;
//   const repo = req.query.repo;

//   try {
//     const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/commits`);
//     const commitCount = response.data.length;
//     res.json({ commitCount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to fetch commit count." });
//   }

//   sortQuery = req.query.sortAsc == 1 ? {commitCount: 1} : {}
//   User.find(
//     userQuery,
//     (err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(users);
//       }
//     }
//   ).sort(sortQuery);
// });

userRoute.route("/user/rating").get(function (req, res) {
  
});

module.exports = userRoute;
