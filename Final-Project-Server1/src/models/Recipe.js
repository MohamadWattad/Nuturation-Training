const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    }, // Name of the recipe
    ingredients: { 
        type: [String], 
        required: true 
    }, // List of ingredients
    calories: { 
        type: Number, 
        required: true 
    }, // Total calories
    protein: { 
        type: Number, 
        required: true 
    }, // Protein in grams
    carbs: { 
        type: Number, 
        required: true 
    }, // Carbs in grams
    fats: { 
        type: Number, 
        required: true 
    }, // Fats in grams
    mealType: { 
        type: String, 
        // enum: ['breakfast', 'lunch', 'dinner', 'snack'], 
        required: false 
    }, // Meal type
    instructions: { 
        type: String, 
        required: false 
    }, // Preparation instructions
});

// Match the schema name to the model name
const Recipe = mongoose.model('Recipe', RecipeSchema);

module.exports = Recipe;
