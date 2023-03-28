const express = require("express");
const userRoute = express.Router();
const User = require("../models/user.model");
const fetch = require('node-fetch');

userRoute.route("/users/all").get(function (req, res) {
  const { userRoleName, sortBy, sortOrder } = req.query;
  const query = userRoleName ? { userRoleName } : {};
  let sortCriteria = {};
  if (sortBy === 'fname') {
    sortCriteria.fname = sortOrder === 'asc' ? 1 : -1;
  } else if (sortBy === 'rating') {
    sortCriteria.rating = sortOrder === 'asc' ? 1 : -1;
  }
  User.find(query, { _id: 1, fname: 1, rating: 1 , GitHubUsername: 1, userRoleName:1 })
      .sort(sortCriteria)
      .exec((err, users) => {
        if (err) {
          res.send(err);
        } else {
          const parsedUsers = users.map(user => ({
            _id: user._id,
            fname: user.fname,
            rating: parseInt(user.rating),
            userRoleName: user.userRoleName,
            GitHubUsername: user.GitHubUsername
          }));
          res.json(parsedUsers);
        }
      });
});

userRoute.route("/users/getRate").get(function (req, res) {
  User.find({}, { _id: 1, fname: 1, rating: 1 ,GitHubUsername:1 ,}, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      const parsedUsers = users.map(user => ({
        _id: user._id,
        fname: user.fname,
        rating: parseInt(user.rating)
      }));
      res.json(parsedUsers);
    }
  });
});



userRoute.route("/users/addRate").post(async (req, res) => {
  const rating = {
    rating1: parseInt(req.body.rating1),
    rating2: parseInt(req.body.rating2),
  };
  const rate = rating.rating1 + rating.rating2;

  User.updateOne(
    { _id: req.body.id },
    {
      $set: {
        rating: rate,
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
      console.log(err);
      return res.json({
        message: "Error in rating",
        status: false,
      });
    });
});


userRoute.route("/users/getTechLead").get(function (req, res) {
  User.find(
    { userRoleName: "TechLead" },
    { fname: 1, lname: 1, GitHubUsername: 1 },
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        // const usersArray = projects.map((item) => item.users);
        // res.json(usersArray);
        let newUsers = []
        for(const user of users) {
          fetch(`https://api.github.com/users/${user.GitHubUsername}`)
          .then(response=>response.json().then(data=>{
              newUsers.push({...user._doc, avatar: data.avatar_url})
          }))
         }
        res.json(newUsers)
      }
    }
  );
});


userRoute.route("/users/getContributors").get(function (req, res) {
  User.find(
    { userRoleName: { $in: ["Developer", "QA", "BA"] } },
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
  User.find(
    { userRoleName: "TeahLead" },
    { fname: 1, lname: 1, GitHubUsername: 1 },
    (err, users) => {
      if (err) {
        res.send(err);
      } else {
        // const usersArray = projects.map((item) => item.users);
        // res.json(usersArray);
        let newUsers = [] 
        for(const user of users) {
          fetch(`https://api.github.com/users/${user.GitHubUsername}`)
          .then(response=>response.json().then(data=>{
              newUsers.push({...user._doc, avatar: data.avatar_url})
          }))
         }
        res.json(newUsers)
      }
    }
  );
});





// API => /users/filters?job=QA&name=Nirush
// Query Method API Call
//userRoute.route("/users/filters").get(function (req, res) {
  // User.find({ userRoleName: { $in: ["QA"] } }, (err, users) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     res.json(users);
  //   }
  // });

  // userRoute.route("/users/filters").get(function (req, res) {
  //   const job = req.query.userRoleName;
  //   const name = req.query.fname;
    
  //   // If job and name are not provided, return all users
  //   if (!job && !name) {
  //     User.find({}, (err, users) => {
  //       if (err) {
  //         res.send(err);
  //       } else {
  //         res.json(users);
  //       }
  //     });
  //   } 
  //   // If job is provided, filter by job
  //   else if (job) {
  //     User.find({ userRoleName: job }, (err, users) => {
  //       if (err) {
  //         res.send(err);
  //       } else {
  //         res.json(users);
  //       }
  //     });
  //   }
  //   // If name is provided, filter by name
  //   else if (name) {
  //     User.find({ fname: name }, (err, users) => {
  //       if (err) {
  //         res.send(err);
  //       } else {
  //         res.json(users);
  //       }
  //     });
  //   }
  // });


userRoute.route("/users/getTechlead/alphabet").get(function (req, res) {
  userQuery = { userRoleName: "TechLead" };
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
  userQuery = { userRoleName: "QA" };
  sortQuery = { fname: 1 };
  User.find(
    userQuery, {fname:1, GitHubUsername:1},
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
  userQuery = { userRoleName: "BA" };
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
  userQuery = { userRoleName: "Developer" };
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


userRoute.route('/users/getLogin').get(async function(req, res) {
  const { GitHubUsername } = req.query;

  // Make request to GitHub API to retrieve number of commits for user
  const response = await fetch(`https://api.github.com/users/${GitHubUsername}/events`);
  const events = await response.json();
  const commits = events
    .filter(event => event.type === 'PushEvent')
    //.reduce((acc, event) => acc + event.payload.commits.length, 0);

  res.json({ commits });
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



module.exports = userRoute;
