const express = require("express");
const jiraRoute = express.Router();
const Issue = require("../models/jira.model");
const axios = require("axios");

// Route to fetch and save issues
jiraRoute.get("/issues", async (req, res) => {
  try {
    // Fetch issues from Jira
    const jiraDomain = "dreamshack.atlassian.net";
    const username = "dreamshack1999@gmail.com";
    const apiToken = process.env.JIRA_API_TOKEN;
    const url = `https://${jiraDomain}/rest/api/2/search?jql=`;
    const auth = {
      username: username,
      password: apiToken,
    };
    const response = await axios.get(url, { auth: auth });
    const issues = response.data.issues;

    // Save new issues to MongoDB
    let newIssuesSaved = 0;
    for (const issue of issues) {
      const issueId = issue.id;
      const existingIssue = await Issue.findOne({ id: issueId });
      if (!existingIssue) {
        const issueData = {
          id: issueId,
          summary: issue.fields.summary,
          description: issue.fields.description,
          projectName: issue.fields.project.name,
          createdBy: issue.fields.creator.displayName,
          createdTime: issue.fields.created,
        };
        const dbIssue = new Issue(issueData);
        await dbIssue.save();
        newIssuesSaved++;
      }
    }

    res.send(`Saved ${newIssuesSaved} new issues to MongoDB`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching and saving issues");
  }
});


jiraRoute.route("/jira/:projectName").get(function (req, res) {
  const projectName = req.params.projectName;
  Issue.find({ projectName: projectName }, {}, (err, issues) => {
    if (err) {
      res.send(err);
    } else {
      res.json(issues);
    }
  });
});

jiraRoute.route("/jiras/all").get(function (req, res) {
  Issue.find({}, (err, issues) => {
    if (err) {
      res.send(err);
    } else {
      res.json(issues);
    }
  });
});
module.exports = jiraRoute;
