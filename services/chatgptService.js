const {OpenAI} = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.CHATGPT_API_KEY,
});

/**
 * Generates a response using OpenAI's ChatGPT model.
 * @param {string} prompt - The prompt to generate a response for.
 * @returns {Promise<string>} - The generated response.
 */
async function generateChatGPTResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      n: 1,
      stop: null,
      temperature: 0.7
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error in generating ChatGPT response:', error);
    throw new Error('Failed to generate response');
  }
}

module.exports = {
  generateChatGPTResponse,
};