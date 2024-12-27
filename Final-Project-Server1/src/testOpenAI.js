const openai = require('./openaiConfig'); // Import OpenAI configuration

async function testOpenAI() {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // Specify the model
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: "Hello, how are you?" },
            ],
        });
        console.log("OpenAI Response:", response.data.choices[0].message.content);
    } catch (error) {
        console.error("Error with OpenAI API:", error.message);
    }
}

testOpenAI();
