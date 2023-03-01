const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res) => {
  const owner = 'OWNER_USERNAME';
  const repo = 'REPO_NAME';
  const token = 'GITHUB_ACCESS_TOKEN';

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contributors`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  const contributors = await response.json();

  // Sort contributors by number of commits in descending order
  contributors.sort((a, b) => b.contributions - a.contributions);

  const leaderboard = contributors.map((contributor) => ({
    login: contributor.login,
    commits: contributor.contributions,
  }));

  res.json(leaderboard);
});

module.exports = router;
