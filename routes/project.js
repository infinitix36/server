const express = require("express");
const projectRoute = express.Router();
const Project = require("../models/project.model");
const User = require("../models/user.model");

// Define the route for updating the options for the "description" field
projectRoute.put("/projects/:projectId/description", async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const descriptionOptions = req.body;

    // Update the options for the "description" field using the findByIdAndUpdate() method
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { description: descriptionOptions },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// get feedbacks of which he is the techlead sent user id by params
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

// get all feedbacks by project id
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

// get all feedback comment by QA
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

//add feedback comment by QA

projectRoute.route("/project/addFeedQA").post(function (req, res) {
  const projectId = req.body.projectId;
  const feedBacks = req.body.feedback;
  const feedBy = req.body.feedBy;

  const newFeedBack = {
    feedId: Date.now(),
    feedback: feedBacks,
    createdDate: Date.now(),
    feedBy: feedBy,
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

//add feedback for project by Techleads

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

// only get project details of specific tech lead

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

// get project details by if he is a contibutor of project

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

// get project details
projectRoute.route("/projects/getProjectDetails").get(function (req, res) {
  Project.find({}, (err, projects) => {
    if (err) {
      res.send(err);
    } else {
      res.json(projects);
    }
  });
});

//get project details which are fill by project manager but did not fill by techlead
projectRoute
  .route("/projects/getIncompleteProjectDetails/:id")
  .get(function (req, res) {
    const id = req.params.id;
    Project.find(
      { $and: [{ techLead: `${id}` }, { completeStatus: false }] },
      (err, projects) => {
        if (err) {
          res.send(err);
        } else {
          res.json(projects);
        }
      }
    );
  });

//add basic project details by project manager
projectRoute.route("/projects/addBasicProjDetails").post(function (req, res) {
  try {
    const projectName = req.body.projectName;
    const description = req.body.description;
    const technology = req.body.technology;
    const projectDeadLine = req.body.deadline;
    const techLead = req.body.techlead;
    const initiatedOn = Date.now();
    const projectManager = req.body.projectManager;

    const project = new Project({
      projectName,
      description,
      technology,
      projectDeadLine,
      initiatedOn,
      projectManager,
      techLead,
    });

    project
      .save()
      .then((item) => {
        res.json({
          message: "Project added successfully",
          status: true,
        });

        const newNotification = {
          message: `${projectName} project has been assigned to you`,
        };

        User.updateOne(
          { _id: techLead },
          { $push: { notification: newNotification } }
        )
          .then(() => {
            console.log("User table updated successfully");
          })
          .catch((err) => {
            console.log("Failed to update user table:", err);
          });
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.json({
            message: "Project already exists",
            status: false,
          });
        } else {
          res.status(500).send({ error: "Error saving data to the database" });
        }
      });
  } catch (error) {
    console.log("Error occurred:", error);
    res.json([{ message: "Data not found", status: false }]);
  }
});

// add extra project details
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
