const mongoose = require("mongoose");

const contributorCommitCountSchema = new mongoose.Schema({
  contributor: String,
  commitCount: Number,
});

const ContributorCommitCount = mongoose.model(
  "ContributorCommitCount",
  contributorCommitCountSchema
);

module.exports = ContributorCommitCount;