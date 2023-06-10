const express = require('express');
const router = express.Router();
const io = require('socket.io-client');
// Notification model (Assuming you have a MongoDB model for notifications)
const Notification = require('../models/notification.model');

// Get all notifications
router.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
