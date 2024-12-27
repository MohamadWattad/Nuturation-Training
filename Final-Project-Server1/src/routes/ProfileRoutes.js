const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = require('../models/Profile');
const requireAuth = require('../middlewares/requireAuth'); // Assuming you have an auth middleware to set req.user

// Route to create a profile
router.post('/profile', requireAuth, async (req, res) => {
    const { age, gender, height, weight, goal, activityLevel, allergies } = req.body;

    // Debugging: Log the request body
    console.log('Request Body:', req.body);

    // Validate required fields
    if (!age || !gender || !height || !weight || !goal || !activityLevel) {
        console.error('Missing required fields');
        return res.status(422).send({
            error: 'Please provide all required fields: age, gender, height, weight, goal, and activityLevel'
        });
    }

    // Check if user is authenticated and has a valid user ID
    if (!req.user || !req.user._id) {
        console.error('User not authenticated:', req.user);
        return res.status(401).send({ error: 'User not authenticated' });
    }

    try {
        //  Log the user ID
        console.log('Authenticated User ID:', req.user._id);

        // Create and save the profile
        const profile = new Profile({
            age,
            gender,
            height,
            weight,
            goal,
            activityLevel,
            allergies: allergies || '', // Default to an empty string if not provided
            userId: req.user._id
        });

        console.log('Profile to Save:', profile);

        await profile.save();
        res.status(201).send(profile);
    } catch (err) {
        console.error('Error saving profile:', err.message);
        res.status(500).send({ error: 'Failed to save profile. Please try again.' });
    }
});

router.get('/profile',requireAuth, async (req , res) => {
    console.log("Received User ID from Middleware:", req.user_id);

    const profile = await Profile.findOne({userId: req.user_id });
    console.log("Profile Found:", profile);

    if(!profile){
        return res.status(404).send({error:'Profile not found'});
    }
    res.send({
        age:profile.age,
        gender:profile.gender,
        height:profile.height,
        weight:profile.weight,
        goal:profile.goal,
        activityLevel:profile.activityLevel,
        BMI:profile.BMI,
    });
});

router.put('/profile',requireAuth, async (req,res) => {
    try{
        const { age, gender, height, weight, goal, activityLevel } = req.body;

        // Convert numeric fields
        const parsedAge = parseInt(age, 10);
        const parsedHeight = parseFloat(height);
        const parsedWeight = parseFloat(weight);
        if (isNaN(parsedAge) || isNaN(parsedHeight) || isNaN(parsedWeight)) {
            return res.status(400).send({ error: 'Age, height, and weight must be numbers' });
        }

        // Ensure required fields are present
        if (!gender || !goal || !activityLevel) {
            return res.status(400).send({ error: 'Missing required fields' });
        }
        const bmi = parsedWeight / ((parsedHeight / 100) ** 2);
        const profile = await Profile.findOneAndUpdate(
            { userId: req.user_id }, // Find the profile by userId
            {
                age: parsedAge,
                gender,
                height: parsedHeight,
                weight: parsedWeight,
                goal,
                activityLevel,
                BMI:bmi
            },
            { new: true }    
        )
        if(!profile){
          return res.status(404).send({error:'Profile not found'});
        }
        res.send({
            age:profile.age,
            gender:profile.gender,
            height:profile.height,
            weight:profile.weight,
            goal:profile.goal,
            activityLevel:profile.activityLevel,
            BMI:bmi,
        });
    }catch(err){
        console.error('Error updating profile:', err.message);
        return res.status(500).send({error:'Failed to update profile. Please try again.'})
    }
});


module.exports = router;
