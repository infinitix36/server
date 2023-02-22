const mongoose = require("mongoose");
const User = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    dob: { type: String },
    phoneNumber: { type: String },
    emailAddress: { type: String, required: true, unique: true },
    department: { type: String },
    jobPosition: { type: String },
    verified: { type: String, default: "false" },
    userStatus: { type: String, default: "active" },
    orangeHRLink: { type: String },
    jiraLink: { type: String },
    githubLink: { type: String },
    userImage: { type: String },
    comments: [{ type: Object }],
    workingOnProjects: [{ type: String }],
  },
  {
    collection: "users",
  }
);
const model = mongoose.model("UserData", User);
module.exports = model;
