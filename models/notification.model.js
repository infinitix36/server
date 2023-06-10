const mongoose = require('mongoose');

// Define the notification schema
const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'notifications', // Specify the collection name
  }
);

// Create the Notification model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
