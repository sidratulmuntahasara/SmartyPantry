import { ChatOpenAI } from "@langchain/openai";
require("dotenv").config();

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("API route hit");
  if (req.method === "POST") {
    const { prompt } = req.body;
    const modifiedPrompt = `Generate recipes for ${prompt} ingredients which are available from the pantry. The output should be in JSON array and each object should contain a recipe name field name (name), description field name (description), array of ingredients (ingredients) and array of step by step instructions named (instructions)`;

    try {
      console.log("Prompt:", modifiedPrompt);
      const response = await chatModel.invoke(modifiedPrompt);
      console.log("API response:", response);

      // Check if the response is valid JSON
      try {
        const jsonResponse = JSON.parse(response); // Ensure response is JSON
        res.status(200).json(jsonResponse);
      } catch (error) {
        console.error("Error parsing response as JSON:", error);
        res.status(500).json({ error: "Failed to parse response as JSON" });
      }
    } catch (error) {
      console.error("Error generating recipes:", error);
      res.status(500).json({ error: "Failed to generate recipes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
