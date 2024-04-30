const express = require('express');
const router  = express.Router();
const { getSavedRecipes, addRecipe } = require('../db/queries/users');



router.get('/user/:userId', (req, res) => {
  // return all saved recipes with a user_id that matches the current users id
  const userId = req.params.userId;

  getSavedRecipes(userId)
  .then(recipes => {
    res.json(recipes);
  })
  .catch(error => {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: "Internal server error" });
  });

});

router.post('/recipe/:userId', (req,res) => {
  // Add a new recipe entry with user_id that matches current users id, recipe data from state
  const userId = req.params.userId;
  const { title, tags, steps } = req.body;

  const recipeObj = {
    title,
    tags,
    steps
  }

  // query to add
  addRecipe(userId, recipeObj)
    .then((response) => {
      // get back the newly added recipeId
      // call a query to create recipe_ingredient
      return response[0].id
    })
    .then((recipeId) => {
      // looping over the ingredients array, and call addRecipeIngredient 
    })

})

router.get('/:userId/:recipeId', (req, res) => {
  // View saved recipe item with an id that matches recipe_id

  const userId = req.params.userId;
  const recipeId = req.params.recipeId;

  const mockRecipe = {
    id: 2,
    title: "Avocado Toast",
    tags: ["Breakfast", "Healthy"],
    ingredients: ["2 slices whole grain bread", "1 ripe avocado", "1 small tomato, sliced", "Salt and black pepper to taste"],
    steps: ["Toast bread", "Mash avocado", "spread on bread"]
  }

  res.json(mockRecipe)
})

router.put('/:userId/:recipeId', (req, res) => {
  // Alter characteristics of a recipe

  const userId = req.params.userId;
  const recipeId = req.params.recipeId;
})

router.delete('/:userId/:recipeId', (req, res) => {
  // Delete saved recipe from saved recipe list
})

module.exports = router;
