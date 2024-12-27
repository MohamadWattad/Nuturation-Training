const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Link to your User model (taking the users)
        required: true,
      },
    age:{
        type:Number,
        required:true,
        
    },
    gender:{
        type:String,
        // enum:["Male" , "Female" , "Other"],
        required:true,
    },
    height:{
        type:Number,
        required:true,
    },
    weight:{
        type:Number,
        required:true,
    },
    goal:{
        type: String,
        // enum: ["Lose weight", "Build muscle", "Maintain fitness", "Other"],
        required: true
    },
    activityLevel: {
        type: String,
        // enum: ["Sedentary", "Lightly Active", "Moderately Active", "Very Active"],
        required: true,
      },
    BMI:{
        type:Number,
        default: null,

    },
    BMICategory: {
        type: String,
    },
    

});

module.exports = mongoose.model('Profile', ProfileSchema);
