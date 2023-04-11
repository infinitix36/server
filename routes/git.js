const express = require("express");
const gitRoute = express.Router();
const axios = require('axios');

const ContributorCommitCount = require("../models/git.model");



async function saveContributorCommitCount(owner) {
    try {
      const response = await axios.get(`https://api.github.com/users/${owner}/repos`);
      const repos = response.data;
  
      const commitCountByContributor = {};
  
      for (const repo of repos) {
        const response = await axios.get(`https://api.github.com/repos/${owner}/${repo.name}/commits`);
        const commits = response.data;
  
        for (const commit of commits) {
          const contributor = commit.author.login;
  
          if (commitCountByContributor[contributor]) {
            commitCountByContributor[contributor]++;
          } else {
            commitCountByContributor[contributor] = 1;
          }
        }
      }
  
      const contributorCommitCounts = Object.entries(commitCountByContributor).map(([contributor, commitCount]) => ({
        contributor,
        commitCount,
      }));
  
      await ContributorCommitCount.insertMany(contributorCommitCounts);
      console.log(commitCountByContributor)
      console.log('Contributor commit count saved to MongoDB');
    } catch (error) {
      console.error(error);
    }
  }
  
  saveContributorCommitCount('dreamshack1999');
  module.exports = gitRoute;