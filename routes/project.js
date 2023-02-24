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

projectRoute.route("/projects/getIncompleteProjectDetails").get(function (req, res) {
  Project.find({completeStatus:false}, (err, projects) => {
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
    const projectName = req.body.projectName;
    const description = req.body.description;
    const technology = req.body.technology;
    const projectDeadLine = req.body.deadline;
    const techLead = req.body.techlead;

    // we are creating a new object of the model
    const project = new Project({
      projectName,
      description,
      technology,
      projectDeadLine,
      techLead,
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


module.exports = projectRoute;
