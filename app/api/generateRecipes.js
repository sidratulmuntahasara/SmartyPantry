import { ChatOpenAI } from "@langchain/openai";
import { NextApiRequest, NextApiResponse } from "next";
require("dotenv").config();


const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  console.log("API route hit");
  if (req.method === 'POST') {
    const { prompt } = req.body;
    const modifiedPrompt = `Generate recipes for ${prompt} ingredients which are available from the pantry. The output should be in JSON array and each object should contain a recipe name field name (name), description field name (description), array of ingredients (ingredients) and array of step by step instructions named (instructions)`;

    try {
      console.log("Prompt:", modifiedPrompt);
      const response = await chatModel.invoke(modifiedPrompt);
      console.log("API response:", response);
      const jsonResponse = JSON.parse(response); // Ensure response is JSON
      res.status(200).json(jsonResponse);
    } catch (error) {
      console.error('Error generating recipes:', error);
      res.status(500).json({ error: 'Failed to generate recipes' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}



// export default async function handler(req, res) {
// 	const { items } = req.body;

// 	try {
//         const response = await fetch(
// 					"https://platform.openai.com/playground/chat?models=gpt-4o-mini-2024-07-18",
// 					{
// 						method: "POST",
// 						headers: {
// 							Authorization: `Bearer ${req.headers["authorization"]}`,
// 							"HTTP-Referer": `https://pantrypal-ai.vercel.app/`,
// 							"X-Title": `https://pantrypal-ai.vercel.app/`,
// 							"Content-Type": "application/json",
// 						},
// 						body: JSON.stringify({
// 							messages: [
// 								{
// 									role: "system",
// 									content:
// 										'Generate recipes for ${prompt} ingredients which are available from the pantry. The output should be in JSON array and each object should contain a recipe name field name (name), description field name (description), array of ingredients (ingredients) and array of step by step instructions named (instructions)',
// 								},
// 								{ role: "user", content: items },
// 							],
// 						}),
// 					}
// 				).then((res) => {
// 					return res.json();
// 				});
// 		return res.status(200).json({ data: response.choices[0].message.content });
// 	} catch (error) {
// 		throw Error(error);
// 	}
// }