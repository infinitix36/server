// const express = require("express");
// const userRoutes = express.Router();
// const User = require("../models/user.model");
// const UserRole = require("../models/userRole.model");
// userRoutes.use(require("../middleware/checkPermission"));

// userRoutes.route("/users/showAllUsers").get(function (req, res) {
//   User.find({})
//     .populate({ path: "department", select: "depName createdBy" })
//     .populate({ path: "userRoleId", select: "userRoleValue" })
//     .exec((err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         res.json(users);
//       }
//     });
// });

// userRoutes.route("/users/getAllUnverifiedUsers").get(function (req, res) {
//   User.find({ verified: false, "userRoleId.userRoleValue": "Hired Employee" })
//     .populate({ path: "department", select: "depName createdBy Jobtitle" })
//     .exec((err, users) => {
//       if (err) {
//         res.send(err);
//       } else {
//         const mappedUsers = users.map((user) => ({
//           ...user.toObject(),
//           userRoleName: user.department.Jobtitle.find((jobTitle) =>
//             jobTitle._id.equals(user.userRoleName)
//           ),
//         }));
//         res.json(mappedUsers);
//       }
//     });
// });
// userRoutes.route("/users/isUserAvailable").post(async (req, res) => {
//   const email = req.body.email;
//   // const count = await User.estimatedDocumentCount({});
//   User.findOne({ emailAddress: email }, (err, users) => {
//     if (err) {
//       res.send(err);
//     } else {
//       if (users) {
//         res.json({ status: true });
//       } else {
//         res.json({ status: false });
//       }
//     }
//   });
// });

// userRoutes.route("/users/isUserCollectionEmpty").get(async (req, res) => {
//   try {
//     const documents = await User.find().lean();
//     const isEmpty = documents.length === 0;
//     res.status(200).json({ status: isEmpty });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// module.exports = userRoutes;

const express = require("express");
const userRoutes = express.Router();
const UserData = require("../models/user.model");
const UserRole = require("../models/userRole.model");
userRoutes.use(require("../middleware/checkPermission"));

userRoutes.route("/users/showAllUsers").get(function (req, res) {
  UserData.find({})
    .populate({ path: "userRoleName", select: "userRoleValue" })
    .exec((err, users) => {
      if (err) {
        res.send(err);
      } else {
        res.json(users);
      }
    });
});

userRoutes.route("/users/getAllUnverifiedUsers").get(function (req, res) {
  UserData.find({
    userStatus: false,
    "userRoleName.userRoleValue": "Hired Employee",
  })
    .populate({ path: "userRoleName", select: "userRoleValue" })
    .exec((err, users) => {
      if (err) {
        res.send(err);
      } else {
        const mappedUsers = users.map((user) => ({
          ...user.toObject(),
          jobTitle: user.department.Jobtitle.find((jobTitle) =>
            jobTitle._id.equals(user.userRoleName)
          ),
        }));
        res.json(mappedUsers);
      }
    });
});

userRoutes.route("/users/isUserAvailable").post(async (req, res) => {
  const email = req.body.email;
  UserData.findOne({ email: email }, (err, users) => {
    if (err) {
      res.send(err);
    } else {
      if (users) {
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    }
  });
});

userRoutes.route("/users/isUserCollectionEmpty").get(async (req, res) => {
  try {
    const documents = await UserData.find().lean();
    const isEmpty = documents.length === 0;
    res.status(200).json({ status: isEmpty });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = userRoutes;
