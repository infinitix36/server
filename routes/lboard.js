const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/', async (req, res) => {
  const jiraBaseUrl = 'https://thanosan.atlassian.net/jira/your-work';
  const jiraUsername = 'vsjathu2000@gmail.com';
  const jiraPassword = 'Venu*1104';
  const projectKey = 'IN';
  const maxResults = 10;

  const response = await axios.get(
    `${jiraBaseUrl}/rest/api/2/search?jql=project=${projectKey}&maxResults=${maxResults}&fields=assignee,issuetype&expand=changelog`,
    {
      auth: {
        username: jiraUsername,
        password: jiraPassword,
      },
    }
  );

  const issues = response.data.issues;
  const contributors = {};

  // Loop through issues and count the number of issues for each assignee
  for (const issue of issues) {
    const assignee = issue.fields.assignee;
    if (assignee) {
      if (contributors[assignee.key]) {
        contributors[assignee.key].issues += 1;
      } else {
        contributors[assignee.key] = {
          name: assignee.displayName,
          issues: 1,
        };
      }
    }
  }

  // Convert contributors object to array and sort by number of issues in descending order
  const leaderboard = Object.values(contributors).sort(
    (a, b) => b.issues - a.issues
  );

  res.json(leaderboard);
});

module.exports = router;
