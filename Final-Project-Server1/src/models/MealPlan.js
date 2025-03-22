const mongoose = require('mongoose');

const MealPlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links the meal plan to a specific user
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    activityLevel: {
        type: String,
        required: true,
    },
    dietaryRestrictions: {
        type: String,
        default: "None",
    },
    calorieTarget: {
        type: Number,
        required: true,
    },
    mealCount: {
        type: Number,
        required: true,
    },
    plan: {
        type: String, // The AI-generated meal plan
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const MealPlan = mongoose.model('MealPlan', MealPlanSchema);
module.exports = MealPlan;
