require('./models/User');
require('./models/Profile');
require('./models/Recipe');
require('./models/Userprogress');
require('./models/Products');
require('./models/Cart');
require('dotenv').config();
require('./models/Video');
require('./models/Recipee');
console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);


const express = require ('express');
const mongoose =require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');
const profileRoutes = require('./routes/ProfileRoutes');
const chatRoutes = require('./routes/chatRoutes'); // Add this line
const app = express();
app.use(bodyParser.json()); //  must be first before authRoutes to translate for mongo
app.use(authRoutes);
app.use(profileRoutes);
app.use(chatRoutes);
const mongoUri = 'mongodb+srv://mohamadwattad70:M7mdwattad123@cluster.xogin.mongodb.net/';

mongoose.connect(mongoUri , {

});

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo successfully');
});

mongoose.connection.on('error',(err) => {
    console.log('Error connection to mongo',err)
});

app.get('/' ,requireAuth,(req,res) => { // requireAuth run first for token ...
    res.send(`Your email is : ${req.user.email}`);
});

app.listen(3000,() => {
    console.log('Listen to port 3000');
});