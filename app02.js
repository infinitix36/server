const express = require('express');
const app = express();

const lboardRouter = require('./routes/lboard');

app.use('/api/lboard', lboardRouter);

// ... other routes and middleware ...

module.exports = app;
