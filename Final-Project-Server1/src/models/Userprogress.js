const mongoose = require('mongoose');

// Create a User Progress Schema
const UserProgressSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    ref: 'User' // If you have a User schema
  },
  steps: {
    type: Number,
    default: 0, // Start from the first step
  },
  responses: {
    type: Map,
    of: String, // Storing responses for each step
  }
});

const UserProgress = mongoose.model('UserProgress', UserProgressSchema);
module.exports = UserProgress;
