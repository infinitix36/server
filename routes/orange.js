const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/leaves', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB database'));

// Define a new schema for leaves in the database
const leaveSchema = new mongoose.Schema({
  startDate: Date,
  endDate: Date,
  type: String,
});

// Create a model for leaves using the schema
const Leave = mongoose.model('Leave', leaveSchema);

// Route for retrieving the number of leaves
app.get('/leaves', async (req, res) => {
  try {
    // Send a request to the OrangeHRM API to retrieve leave data
    const response = await axios.get('https://orangehrm-api.com/leaves');

    // Parse the response and extract the number of leaves
    const leaves = response.data.leaves;
    const numLeaves = leaves.length;

    // Save the number of leaves to the MongoDB database
    const newLeave = new Leave({ startDate: new Date(), endDate: new Date(), type: 'annual' });
    await newLeave.save();

    // Return the number of leaves to the client
    res.send(`Number of leaves: ${numLeaves}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
