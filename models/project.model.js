const mongoose = require("mongoose");
const Project = new mongoose.Schema(
  {
    projectName: { type: String, unique: true },
    description: { type: String },
    technology: { type: String },
    projectDeadLine: { type: String },
    techLead: { type: String },
    projectStatus: { type: String },
    initiatedOn: { type: Date },
    completedOn: { type: Date },
    gitHubLink: { type: String },
    jiraLink: { type: String },
    projectManager: { type: String },
    contributors: [{ type: String }],
    clientDetails: { type: Object },
    completeStatus: { type: Boolean, default: false },
  },
  {
    collection: "projects",
  }
);
const model = mongoose.model("ProjectData", Project);
module.exports = model;
