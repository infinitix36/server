const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    userRoleName: { type: String },
    fname: { type: String },
    lname: { type: String },
    email: { type: String, required:true, unique:true },
    phone: { type: String },
    password: { type: String},
    userStatus: { type: Boolean},
    orangeHrLink: { type: String },
    GitHubUsername: { type: String },
    userJiraLink: { type: String },
    userImage: [{ type: Object}],
    feedback: { type: String}
  },
  {
    collection: "userRoles",
  }
);
const model = mongoose.model("UserData", User);
module.exports = model;
