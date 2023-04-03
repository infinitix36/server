const mongoose = require("mongoose");
const Jira = new mongoose.Schema(
  {
    id: String,
    summary: String,
    description: String,
    projectName: String,
    createdTime: Date,
    createdBy: String,
    
  }
  
);
const model = mongoose.model("JiraData", Jira);
module.exports = model;
