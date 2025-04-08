const mongoose = require ("mongoose");

const recipeeSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true, // remove spaces , tabs ...
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:[String], // Array -> ["BreakFast" ,"Pre-Workout".. ]
        default:[]
    },
    calories:{
        type:Number,
        required:true,
    },
    carbs:{
        type:Number,
        required:true
    },
    fat:{
        type:Number,
        required:true
    },
    protein:{
        type:Number,
        required:true
    },
    ingredients:{
        type:[String],
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    }
});

module.exports = mongoose.model("Recipee",recipeeSchema);
