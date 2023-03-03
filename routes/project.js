const express = require("express");
const projectRoute = express.Router();
const Project = require("../models/project.model");

projectRoute.route("/projects/getProjectDetails").get(function (req, res) {
  Project.find({}, (err, projects) => {
    if (err) {
      res.send(err);
    } else {
      res.json(projects);
    }
  });
});

projectRoute
  .route("/projects/getIncompleteProjectDetails")
  .get(function (req, res) {
    Project.find({ completeStatus: false }, (err, projects) => {
      if (err) {
        res.send(err);
      } else {
        res.json(projects);
      }
    });
  });

projectRoute.route("/projects/addBasicProjDetails").post(function (req, res) {
  try {
    // variable should be in the name as in the model
    const clientDetails = req.body.clientDetails;
    const gitHubLink = req.body.gitHubLink;
    const jiraLink = req.body.jiraLink;
    const projectDeadLine = req.body.deadline;
    const contributors = req.body.contributors;
    const initiatedOn = Date.now();
    const projectManager = "4";

    // we are creating a new object of the model
    const project = new Project({
      clientDetails,
      gitHubLink,
      jiraLink,
      projectDeadLine,
      contributors,
      initiatedOn,
      projectManager,
    });

    // we are saving the data to the database
    project
      .save()
      .then((item) =>
        res.json({
          message: "Project added successfully",
          status: true,
        })
      )
      .catch((err) => {
        // error code 11000 is for duplicate data in mongo db
        if (err.code === 11000) {
          return res.json({
            message: "Project already exists",
            status: false,
          });
        }
        res.status(500).send({ error: "Error saving data to the database" });
      });
  } catch {
    return res.json([{ message: "Data Not Found", status: "false" }]);
  }
});

projectRoute.route("/projects/addExtraProjDetails").post(async (req, res) => {
  try {
    // variable should be in the name as in the model
    const gitHubLink = req.body.gitHubLink;
    const jiraLink = req.body.jiraLink;

    const clientDetails = {
      clientName:req.body.clientName,
      clientAddress:req.body.clientAddress,
      clientPhoneNumber:req.body.clientPhone
    }
    const projectName = req.body.projectName;
    const contributors= req.body.contributors;
    // we are creating a new object of the model
    // const project = new Project({
    //   clientDetails,
    //   gitHubLink,
    //   jiraLink,
    // });

    Project.updateOne(
      { projectName: projectName },
      { $set: { gitHubLink: gitHubLink, jiraLink: jiraLink ,clientDetails:clientDetails,completeStatus:true,contributors:contributors} }
    )
      .then((item) =>
        res.json({
          message: "Project Extra Details added successfully",
          status: true,
        })
      )
      .catch((err) => {
        // error code 11000 is for duplicate data in mongo db
        if (err.code === 11000) {
          return res.json({
            message: "Project already exists",
            status: false,
          });
        }
        res.status(500).send({ error: "Error saving data to the database" });
      });
  } catch {
    return res.json([{ message: "Data Not Found", status: "false" }]);
  }
});

module.exports = projectRoute;
