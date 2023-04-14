const express = require("express");
const projectRoute = express.Router();
const Project = require("../models/project.model");

// Define the route for updating the options for the "description" field
projectRoute.put('/projects/:projectId/description', async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const descriptionOptions = req.body;

    // Update the options for the "description" field using the findByIdAndUpdate() method
    const updatedProject = await Project.findByIdAndUpdate(projectId, {  description: descriptionOptions.description }, { new: true });

    if (!updatedProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
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

  //add basic project details by project manager
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