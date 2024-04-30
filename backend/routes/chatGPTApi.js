const express = require('express');
const router  = express.Router();
const axios = require ('axios');
const OpenAIApi = require('openai')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });


const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY
});

// use this example JSON in system prompt to make sure it returns the JSON format we want
const exampleJson = {
  "title": "Classic Bread",
  "tags": ["baking", "bread"],
  "steps": [
    "1. Mix ingredients.",
    "2. Knead dough.",
    "3. Let rise.",
    "4. Bake at 200°C for 30 minutes."
  ],
  "ingredients": [
    { "ingredient": "Flour", "quantity": 15.00, "units": "grams", "id": "1" },
    { "ingredient": "Yeast", "quantity": 5.00, "units": "grams", "id": "2" }
  ]
}
// check if the ingredient id it returns is correct!!

const recipeSystemPrompt = `Provide Valid JSON format response. Create a recipe based on user's prompt.
It should include the title of the recipe, ingredients that it needs,
tags that it fits into and the steps that are required to make it.
The data schema should follow this example \`${JSON.stringify(exampleJson)}\`
ONLY use the ingredients provied by the user, DO NOT ADD ANY OTHERS`

router.post('/', async (req, res) => {
  const { recipeTags, recipeFocus, recipeAvoid, allIngredients } = req.body;

  console.log("Ingredient List", allIngredients)

  const userPrompt = `
    Given ONLY these ingredients: ${JSON.stringify(allIngredients)}, your task is to craft a recipe that fits the provided tags: ${recipeTags}.
    However, please try to use these ingredients: ${recipeFocus}, and avoid incorporating the following ingredients: ${recipeAvoid}.
    DO NOT ADD INGREDIENTS THAT I DON'T HAVE.
  `;

  try {
    // Make the API request to OpenAI
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: recipeSystemPrompt },
          { role: 'user', content: userPrompt }
        ],
        // Temperature controls how unexpected the output can be, 0 being most conservative
        temperature: 0
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        }
      }
    );

    // Extract AI response from the API response
    const aiResponse = (response.data.choices[0].message.content);

    // Send AI response back to client
    // console.log(aiResponse);
    res.status(200).json(aiResponse);
  } catch (error) {
    console.error('An error occurred:', error.message);
    res.status(500).json({ error: 'An error occurred' });
  }
});


module.exports = router;
