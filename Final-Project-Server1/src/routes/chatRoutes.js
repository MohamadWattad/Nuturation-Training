const express = require('express');
const router = express.Router();
const UserProgress = require('../models/Userprogress'); 
const requireAuth = require('../middlewares/requireAuth');
const openai = require('../openaiConfig');
const MealPlan = require('../models/MealPlan'); // make sure it's imported
const User = require('../models/User'); // if you need to check the user



router.post('/chat/questions', requireAuth, async (req, res) => {
    const defaultQuestions = [
        "What is your gender? (Male/Female)",
        "What is your height in cm?",
        "What is your weight in kg?",
        "What is your age?",
        "What is your goal? (Gain muscle, Lose fat, Maintain weight)",
        "How active are you daily? (Sedentary, Lightly active, Moderately active, Very active)",
        "What do you typically eat in a day? (e.g., Breakfast: Eggs & toast, Lunch: Chicken & rice, etc.)",
        "Do you have any dietary restrictions or allergies? (e.g., Dairy, Gluten, Nuts)",
        "What is your daily calorie target? (If unsure, type 'I don't know' and I'll estimate it)",
        "How many meals do you prefer per day?"
    ];

    const userId = req.user_id;
    const userInput = req.body.message.toLowerCase().trim();

    console.log(`🔵 User ${userId} sent message: "${userInput}"`);

    if (["hey", "hi", "hello"].includes(userInput)) {
        return res.json({ 
            message: "Hey there! 👋 I can create a meal plan tailored to your needs. Let's start!",
            question: defaultQuestions[0]
        });
    }

    let userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
        userProgress = new UserProgress({
            userId,
            steps: 0, 
            responses: {},
        });
        await userProgress.save();
        console.log(`🟢 New progress created for user ${userId}`);
    }

    const currentStep = userProgress.steps;
    console.log(`🟡 Current Step for user ${userId}: ${currentStep}`);

    try {
        console.log(`✅ User ${userId} answered step ${currentStep}:`, userInput);

        userProgress.responses.set(`step${currentStep}`, userInput);
        await userProgress.save();
        console.log(`📝 Saved response for step ${currentStep}:`, userProgress.responses);

        if (currentStep < defaultQuestions.length - 1) {
            userProgress.steps += 1;
            await userProgress.save();
            console.log(`🔄 Moving to step ${userProgress.steps} for user ${userId}`);

            return res.json({
                message: "Got it! " + defaultQuestions[userProgress.steps],
                question: defaultQuestions[userProgress.steps],
            });
        } else {
            console.log(`🚀 User ${userId} completed all steps. Generating meal plan...`);
            console.log("🟠 Full user responses:", userProgress.responses);

            const gender = userProgress.responses.get('step0');
            const height = parseInt(userProgress.responses.get('step1'), 10);
            const weight = parseInt(userProgress.responses.get('step2'), 10);
            const age = parseInt(userProgress.responses.get('step3'), 10);
            const goal = userProgress.responses.get('step4') || "Maintain weight";
            const activityLevel = userProgress.responses.get('step5') || "Moderately active";
            const currentDiet = userProgress.responses.get('step6') || "Varied";
            const restrictions = userProgress.responses.get('step7') || "None";
            let calorieTarget = userProgress.responses.get('step8');
            const mealCount = parseInt(userProgress.responses.get('step9'), 10);

            console.log(`⚡ Gender: ${gender}`);
            console.log(`⚡ Height: ${height} cm`);
            console.log(`⚡ Weight: ${weight} kg`);
            console.log(`⚡ Age: ${age}`);
            console.log(`⚡ User goal: ${goal}`);
            console.log(`⚡ Activity Level: ${activityLevel}`);
            console.log(`⚡ User-Selected Daily Calories: ${calorieTarget}`);
            console.log(`⚡ Meal Count: ${mealCount}`);

            // 🔹 If user doesn't know their calorie target, estimate it using BMR
            if (!calorieTarget || calorieTarget === "i don't know") {
                console.log("⚠️ User doesn't know calorie target. Estimating using BMR...");
                calorieTarget = estimateCalories(gender, height, weight, age, goal, activityLevel);
                console.log(`🟢 Estimated Calorie Target: ${calorieTarget} kcal`);
            } else {
                calorieTarget = parseInt(calorieTarget, 10);
            }

            const nutritionPlan = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    { role: "system", content: "You are a professional nutritionist creating structured meal plans based on user goals." },
                    { 
                        role: "user", 
                        content: `Create a meal plan based on:
                        - **User Gender**: ${gender}
                        - **Height**: ${height} cm
                        - **Weight**: ${weight} kg
                        - **Age**: ${age}
                        - **User Goal**: ${goal}
                        - **Activity Level**: ${activityLevel}
                        - **Current Diet**: ${currentDiet}
                        - **Dietary Restrictions**: ${restrictions}
                        - **Total Daily Calories**: ${calorieTarget} kcal
                        - **Number of Meals**: ${mealCount}
            
                        🔹 **VERY IMPORTANT**: 
                        - The **total daily calories must be exactly ${calorieTarget} kcal**.
                        - Each meal must have **realistic calorie values**.
                        - **Use real-world food data** for protein, fats, and carbs.
                        - Ensure proper nutrient balance.
                        
                        🔹 **FORMAT THE RESPONSE LIKE THIS:**  
                        
                        **Meal 1: [Meal Name]**  
                        - 🍽️ **Calories**: [REAL kcal value]
                        - 🍗 **Protein**: [REAL amount]
                        - 🍞 **Carbs**: [REAL amount]
                        - 🥑 **Fats**: [REAL amount]
                        📌 **Recipe**: [Accurate Preparation Instructions]
            
                        Continue this format for **${mealCount} meals**, ensuring total calories = **${calorieTarget} kcal**.` 
                    }
                ],
                max_tokens: 1000,
            });

            const planText = nutritionPlan.choices[0]?.message?.content?.trim();
            console.log("✅ AI Generated Plan:", planText);
            const newMealPlan = new MealPlan({
                userId: userId,
                goal: goal,
                activityLevel: activityLevel,
                dietaryRestrictions: restrictions,
                calorieTarget: calorieTarget,
                mealCount: mealCount,
                plan: planText,
            });
            
            await newMealPlan.save();
            console.log("✅ Meal plan saved successfully for user:", userId);

            await UserProgress.deleteOne({ userId });

            return res.json({
                message: "Thanks for your answers! Here is your personalized nutrition plan:",
                plan: planText,
            });
        }
    } catch (error) {
        console.error("❌ Error processing chatbot step for user:", userId, error.message);
        return res.status(500).json({ error: "Failed to process your response. Please try again." });
    }
});

// 🔥 Function to estimate calories using BMR
function estimateCalories(gender, height, weight, age, goal, activityLevel) {
    const activityMultipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725
    };

    let bmr;
    if (gender.toLowerCase() === "male") {
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    let estimatedCalories = bmr * (activityMultipliers[activityLevel.toLowerCase()] || 1.55);

    if (goal.toLowerCase() === "gain muscle") {
        estimatedCalories += 500;
    } else if (goal.toLowerCase() === "lose fat") {
        estimatedCalories -= 500;
    }

    return Math.round(estimatedCalories);
}

router.get('/getMealPlan' ,requireAuth , async(req , res)=>{
    try{
        const mealPlans = await MealPlan.find({ userId: req.user_id }).sort({ createdAt: -1 });

        res.status(200).send({
            message: "Meal plans retrieved successfully",
            mealPlans: mealPlans,
          });
    }catch (error) {
        console.error("❌ Error fetching meal plans:", error.message);
        res.status(500).send({ error: "Failed to retrieve meal plans" });
      }
})


module.exports = router;