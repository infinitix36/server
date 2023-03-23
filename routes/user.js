const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");
const fetch = require('node-fetch');

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

userRoute.route("/users/getBA").get(function (req, res) {
  User.find({ useRoleName: { $in: ["BA"] } }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      res.json(users);
    }
  });
});

userRoute.route("/users/getTechlead/alphabet").get(function (req, res) {
  userQuery = { useRoleName: "TeahLead" };
  sortQuery = { fname: 1 };
  User.find(
    userQuery,{fname:1},
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  ).sort(sortQuery);
});

userRoute.route("/users/getQA/alphabet").get(function (req, res) {
  userQuery = { useRoleName: "QA" };
  sortQuery = { fname: 1 };
  User.find(
    userQuery, {fname:1},
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  ).sort(sortQuery);
});



userRoute.route("/users/getBA/alphabet").get(function (req, res) {
  userQuery = { useRoleName: "BA" };
  sortQuery = { fname: 1 };
  User.find(
    userQuery, {fname:1},
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  ).sort(sortQuery);
});



userRoute.route("/users/getDeveloper/alphabet").get(function (req, res) {
  userQuery = { useRoleName: "Developer" };
  sortQuery = { fname: 1 };
  User.find(
    userQuery, {fname:1},
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    }
  ).sort(sortQuery);
});














// userRoute.route("/users/getTechlead/avatar").get(function (req, res) {
//   userQuery = { useRoleName: "TeahLead" };
//   User.find(
//     userQuery,{github: 1},
//     async (err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         // Fetch the avatar URLs for each user's GitHub profile
//         const usersWithAvatars = await Promise.all(
//           users.map(async (user) => {
//             if (users.
//               userGitHubLink) {
//               const githubUsername = users.userGitHubLink.split("/").pop();
//               const githubApiUrl = `https://api.github.com/users/${userGitHubLink}`;
//               const response = await axios.get(githubApiUrl);
//               const avatarUrl = response.data.avatar_url;
//               return { ...user._doc, avatarUrl };
//             } else {
//               return user._doc;
//             }
//           })
//         );
//         res.json(usersWithAvatars);
//       }
//     }
//   ).sort(sortQuery);
// });









// userRoute.route("/users/getBA/alphabet").get(function (req, res) {
//   sortQuery1 = req.query.sortAsc == 1 ? {fname: 1} : {}
//   User.find({ useRoleName: { $in: ["BA"] } }, (err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(users);
//       }
//     }
//   ).sort(sortQuery);
// });

// userRoute.route("/users/getQA/alphabet").get(function (req, res) {
//   sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
//   User.find({ useRoleName: { $in: ["QA"] } }, (err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(users);
//       }
//     }
//   ).sort(sortQuery);
// });

// userRoute.route("/users/getTechlead/alphabet").get(function (req, res) {
//   sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
//   User.find({ useRoleName: { $in: ["Teahlead"] } }, (err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(users);
//       }
//     }
//   ).sort(sortQuery);
// });


// userRoute.route("/users").get(function (req, res) {
//   userQuery = req.query.roleName ? {useRoleName: req.query.roleName} : {}
//   sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
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



// userRoute.route("/user/alphabet").get(function (req, res) {
//   userQuery = req.query.roleName ? {useRoleName: req.query.roleName} : {}
//   sortQuery = req.query.sortAsc == 1 ? {fname: 1} : {}
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
