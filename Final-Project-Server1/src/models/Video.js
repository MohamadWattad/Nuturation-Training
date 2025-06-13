const mongoose = require("mongoose");

const trainingGifSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title of the exercise
    trim: true,
  },
  gifUrl: {
    type: String,
    required: true, // URL to the GIF file
  },
  muscleGroup: {
    type: String,
    required: true, // Muscle group the exercise targets
  },
  description: {
    type: String, // A short description of the exercise
    trim: true,
  },
  duration: {
    type: String, // Optional field for exercise duration or repetitions
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
});

module.exports = mongoose.model("TrainingGif", trainingGifSchema);