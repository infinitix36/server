const mongoose = require("mongoose");
const Project = new mongoose.Schema(
  {
    projectName: { type: String },
    Technolgy: { type: String },
    projectStatus: { type: String },
    description: { type: String },
    initiatedOn: { type: Date },
    completedOn: { type: Date },
    projectDeadLine: { type: Date },
    gitHubLink: { type: String },
    jiraLink: { type: String },
    projectManager: { type: String },
    teamLead: { type: String },
    contributors: [{ type: String }],
    clientDetails: { type: Object },
  },
  {
    collection: "projects",
  }
);
const model = mongoose.model("ProjectData", Project);
module.exports = model;
