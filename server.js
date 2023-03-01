// server.js

const express = require('express');
const axios = require('axios');
const app = express();

// Your GitHub and Jira API credentials and URLs
const GITHUB_URL = 'https://api.github.com';
const GITHUB_TOKEN = '';
const JIRA_URL = 'https://<yourcompany>.atlassian.net/rest/api/2';
const JIRA_USERNAME = '<Your Jira username>';
const JIRA_PASSWORD = '<Your Jira API token>';

// Endpoint to get the merged data
app.get('/merged-data', async (req, res) => {
  try {
    // Make a request to the GitHub API to get your repositories
    const githubResponse = await axios.get(`${GITHUB_URL}/user/repos`, {
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
    });
    const githubRepos = githubResponse.data;

    // Make a request to the Jira API to get your issues
    const jiraResponse = await axios.get(`${JIRA_URL}/search`, {
      auth: { username: JIRA_USERNAME, password: JIRA_PASSWORD },
      params: { jql: 'assignee=currentuser()' },
    });
    const jiraIssues = jiraResponse.data.issues;

    // Merge the GitHub and Jira data
    const mergedData = { githubRepos, jiraIssues };

    res.json(mergedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
