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
    const apiToken =
      "ATATT3xFfGF0e6CUdT-56AvrnKIEHnJHi7kO-HgN8QT9BzheNzf_InD5GV_nlQjmhJhUOZLUKj-tH0lsh_q6M4sqt3rQ94gbgOVAaq2bkAwJXXwxE0iAlYKRNhFck4npLKur-0vBB5IszXsPnQmUMDdPLHRkX0Deg3an8625DVY5grX0K8cLypQ=77274B81";
    const url = `https://${jiraDomain}/rest/api/2/search?jql=`;
    const auth = {
      username: username,
      password: apiToken,
    };
    const response = await axios.get(url, { auth: auth });
    const issues = response.data.issues;

    // Save issues to MongoDB
    for (const issue of issues) {
      const issueData = {
        id: issue.id,
        summary: issue.fields.summary,
        description: issue.fields.description,
        projectName: issue.fields.project.name,
        createdBy: issue.fields.creator.displayName,
        createdTime: issue.fields.created,
      };
      const dbIssue = new Issue(issueData);
      await dbIssue.save();
    }

    res.send(`Saved ${issues.length} issues to MongoDB`);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching and saving issues");
  }
});

module.exports = jiraRoute;
