const express = require("express");
const projectRoute = express.Router();
const Project = require("../models/project.model");

projectRoute.route("/projects/getFeedbacks/:userId").get(function (req, res) {
  const userId = req.params.userId;
  Project.find(
    { techLead: userId },
    { feedBacks: 1, projectName: 1 },
    (err, projects) => {
      if (err) {
        res.send(err);
      } else {
        res.json(projects);
      }
    }
  );
});
projectRoute.route("/projects/getFeedback/:projectId").get(function (req, res) {
  const projectId = req.params.projectId;
  Project.find({ _id: projectId }, { feedBacks: 1 }, (err, projects) => {
    if (err) {
      res.send(err);
    } else {
      res.json(projects);
    }
  });
});
projectRoute
  .route("/projects/getFeedbackQA/:projectId")
  .get(function (req, res) {
    const projectId = req.params.projectId;
    Project.find({ _id: projectId }, { feedBacksQA: 1 }, (err, projects) => {
      if (err) {
        res.send(err);
      } else {
        res.json(projects);
      }
    });
  });

projectRoute.route("/project/addFeedQA").post(function (req, res) {
  const projectId = req.body.projectId;
  const feedBacks = req.body.feedback;
  const feedBy = req.body.feedBy;
  const feedbyName = req.body.feedbyName;

  const newFeedBack = {
    feedId: Date.now(),
    feedback: feedBacks,
    createdDate: Date.now(),
    feedBy: feedBy,
    feedbyName: feedbyName,
  };

  Project.findOneAndUpdate(
    { _id: projectId },
    { $push: { feedBacksQA: newFeedBack } },

    (err, projects) => {
      if (err) {
        return res.json({
          message: "Error try again !",
          status: false,
        });
      } else {
        return res.json({
          message: "feedback Added Successfully",
          status: true,
        });
      }
    }
  );
});
projectRoute.route("/project/addFeed").post(function (req, res) {
  const projectId = req.body.projectId;
  const feedBacks = req.body.feedback;
  const feedBy = req.body.feedBy;
  const feedbyName = req.body.feedbyName;

  const newFeedBack = {
    feedId: Date.now(),
    feedback: feedBacks,
    createdDate: Date.now(),
    feedBy: feedBy,
    feedbyName: feedbyName,
  };

  Project.findOneAndUpdate(
    { _id: projectId },
    { $push: { feedBacks: newFeedBack } },

    (err, projects) => {
      if (err) {
        return res.json({
          message: "Error try again !",
          status: false,
        });
      } else {
        return res.json({
          message: "feedback Added Successfully",
          status: true,
        });
      }
    }
  );
});

projectRoute
  .route("/projects/getProjectDetailsTL/:id")
  .get(function (req, res) {
    const id = req.params.id;
    Project.find({ techLead: `${id}` }, { projectName: 1 }, (err, projects) => {
      if (err) {
        res.send(err);
      } else {
        res.json(projects);
      }
    });
  });

projectRoute.route("/projects/getProjectDetails/:id").get(function (req, res) {
  const id = req.params.id;
  Project.find({ "contributors.value": `${id}` }, (err, projects) => {
    if (err) {
      res.send(err);
    } else {
      res.json(projects);
    }
  });
});

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

    const projectName = req.body.projectName;
    const description = req.body.description;
    const technology = req.body.technology;
    const projectDeadLine = req.body.deadline;
    const techLead = req.body.techlead;
    const initiatedOn = Date.now();
    const projectManager = req.body.projectManager;

    // we are creating a new object of the model
    const project = new Project({
      projectName,
      description,
      technology,
      projectDeadLine,
      initiatedOn,
      projectManager,
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

projectRoute.route("/projects/addExtraProjDetails").post(async (req, res) => {
  const gitHubLink = req.body.gitHubLink;
  const jiraLink = req.body.jiraLink;
  const clientDetails = {
    clientName: req.body.clientName,
    clientAddress: req.body.clientAddress,
    clientPhoneNumber: req.body.clientPhone,
  };
  const contributors = req.body.contributors;
  console.log(contributors);

  const contributorsArray = contributors.map((contri) => ({
    label: contri.label,
    value: contri.value,
  }));
  Project.updateOne(
    { _id: req.body.projectId },
    {
      $set: {
        gitHubLink: gitHubLink,
        jiraLink: jiraLink,
        clientDetails: clientDetails,
        completeStatus: true,
        contributors: contributorsArray,
      },
    }
  )
    .then((result) => {
      return res.json({
        message: "Project updated successfully",
        status: true,
      });
    })
    .catch((err) => {
      return res.json({
        message: "Error in Updating Project Name",
        status: false,
      });
    });
});
module.exports = projectRoute;