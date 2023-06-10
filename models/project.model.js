const mongoose = require("mongoose");
const Project = new mongoose.Schema(
  {
    projectName: { type: String },
    technology: { type: String },
    projectStatus: { type: String },
    description: { type: String },
    initiatedOn: { type: Date },
    completeStatus: { type: Boolean, default: false },
    completedOn: { type: Date },
    clientDetails: { type: Object },
    projectDeadLine: { type: String },
    gitHubLink: { type: String },
    jiraLink: { type: String },
    projectManager: { type: String },
    techLead: { type: String },
    contributors: { type: Object },
    feedBacks: [{ type: Object }],
    stage: { type: Number, default: 0 },
    feedBacksQA: [{ type: Object }],
  },
  {
    collection: "projects",
  }
);
const model = mongoose.model("ProjectData", Project);
module.exports = model;
