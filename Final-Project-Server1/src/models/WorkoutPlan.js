const mongoose = require ('mongoose');

const WorkoutPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      exercises: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TrainingGif", // Linking to existing exercise videos
        }
      ],
      createdAt: {
        type: Date,
        default: Date.now,
      }       
});
module.exports = mongoose.model("WorkoutPlan" , WorkoutPlanSchema);
