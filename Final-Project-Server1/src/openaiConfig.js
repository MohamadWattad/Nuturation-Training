require('dotenv').config(); // Load environment variables

const { OpenAI } = require('openai'); // In version 4.x.x, we use the OpenAI class directly

// Initialize the OpenAI client with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key from environment
});

module.exports = openai;