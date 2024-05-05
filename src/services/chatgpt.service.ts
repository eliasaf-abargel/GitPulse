// const {OpenAI} = require("openai");
import OpenAI from "openai";
import { chatgptApiKey } from "../config/envConfig";

const openai = new OpenAI({
  apiKey: chatgptApiKey,
});

const generateChatGPTResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 4096,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    if (response.choices?.[0]?.message?.content) {
      return response.choices[0].message.content.trim();
    }
    throw new Error("No response received from ChatGPT.");
  } catch (error) {
    console.error("Error in generating ChatGPT response:", error);
    throw new Error("Failed to generate response");
  }
};

const sendResponseGptervices = (response_url: string, arg1: string): void => {
  throw new Error("Function not implemented.");
};

export { generateChatGPTResponse, sendResponseGptervices };
