const express = require('express');
const app = express();

const leaderboardRouter = require('./routes/leaderboard');

app.use('/api/leaderboard', leaderboardRouter);

// ... other routes and middleware ...

module.exports = app;
