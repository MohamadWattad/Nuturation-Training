const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const UserProgress = require('../models/Userprogress'); // Import the UserProgress schema
const requireAuth = require('../middlewares/requireAuth');
const openai = require('../openaiConfig'); // Import OpenAI configuration

// Chatbot questions route
router.post('/chat/questions', requireAuth, async (req, res) => {
    const defaultQuestions = [
        "What ingredients or types of food do you like? (e.g., Chicken, Broccoli, Fish)",
        "Do you have any dietary restrictions or allergies? (e.g., Dairy, Gluten, Nuts)",
        "What is your daily calorie target? (e.g., 2000 calories)",
        "How many meals do you eat per day? (e.g., 3, 4, or 5)"
    ];

    const userId = req.user_id;

    // Check if the user has previous progress saved in the database
    let userProgress = await UserProgress.findOne({ userId });

    // If the user doesn't have progress, initialize a new entry
    if (!userProgress) {
        userProgress = new UserProgress({
            userId,
            steps: 0, // Start from the first step
            responses: {},
        });
        await userProgress.save(); // Save initial progress
    }

    // Retrieve the current step (this is the step where the user left off)
    const currentStep = userProgress.steps;

    try {
        // Save the user's response for the current step
        const userInput = req.body.message;
        console.log(`User ${userId} answered step ${currentStep}:`, userInput);

        // Validation for each question
        if (currentStep === 0 && !/^[a-zA-Z, ]+$/.test(userInput)) {
            // Invalid input for food preferences (expecting food names separated by commas)
            return res.json({
                message: "Please provide a valid list of ingredients you like, separated by commas. Example: Chicken, Broccoli, Fish.",
                question: defaultQuestions[currentStep],
            });
        }

        if (currentStep === 1 && !/^[a-zA-Z, ]+$/.test(userInput)) {
            // Invalid input for dietary restrictions (expecting allergies or food restrictions separated by commas)
            return res.json({
                message: "Please provide a valid list of dietary restrictions or allergies, separated by commas. Example: Dairy, Gluten, Nuts.",
                question: defaultQuestions[currentStep],
            });
        }

        if (currentStep === 2 && !/^\d+$/.test(userInput)) {
            // Invalid input for calorie target (expecting a numeric value)
            return res.json({
                message: "Please provide a valid number for your daily calorie target.",
                question: defaultQuestions[currentStep],
            });
        }

        if (currentStep === 3 && !/^\d+$/.test(userInput)) {
            // Invalid input for meals per day (expecting a numeric value)
            return res.json({
                message: "Please provide a valid number for the number of meals you eat per day.",
                question: defaultQuestions[currentStep],
            });
        }

        // Save valid response
        userProgress.responses[`step${currentStep}`] = userInput;
        await userProgress.save();

        // If the user hasn't completed all steps, move to the next question
        if (currentStep < defaultQuestions.length - 1) {
            userProgress.steps += 1;
            await userProgress.save(); // Save the updated step

            // Respond with the next question
            return res.json({
                message: defaultQuestions[userProgress.steps],
                question: defaultQuestions[userProgress.steps],
            });
        } else {
            // After all questions are answered, generate the meal plan
            console.log(`User ${userId} completed all steps. Generating meal plan...`);

            const preferences = userProgress.responses.step0 || "";
            const restrictions = userProgress.responses.step1 || "";
            const calorieTarget = userProgress.responses.step2 || "";
            const mealCount = userProgress.responses.step3 || "";

            // Use OpenAI to create a nutrition plan based on user responses
            const nutritionPlan = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a skilled nutritionist creating personalized meal plans." },
                    { role: "user", content: `Create a detailed nutrition plan based on the following information:\nPreferences: ${preferences}\nRestrictions: ${restrictions}\nCalorie Target: ${calorieTarget}\nNumber of Meals: ${mealCount}. Please include nutritional values (Calories, Protein, Carbs, Fats) for each meal.` }
                ],
                max_tokens: 500,
            });

            const planText = nutritionPlan.choices[0]?.message?.content?.trim();

            // Clear user progress after generating the plan
            await UserProgress.deleteOne({ userId });

            return res.json({
                message: "Thanks for your answers! Here is your personalized nutrition plan:",
                plan: planText,
            });
        }
    } catch (error) {
        console.error("Error processing chatbot step for user:", userId, error.message);
        return res.status(500).json({ error: "Failed to process your response. Please try again." });
    }
});


module.exports = router;
