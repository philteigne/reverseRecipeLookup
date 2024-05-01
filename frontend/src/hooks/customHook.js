import { useCallback, useReducer, useEffect } from 'react';

export const API_CALL_URL = "http://localhost:8080/api/"
const userId = 1

export const INITIAL_STATE = {
  userId: 1,
  // Pantry components
  ingredientList: [],
  deleteIngredientState: null,
  addIngredientState: null,
  // Recipes Components
  activeRecipe: 2,
  recipes: [],
  recipeIngredients: [],
  isLoading: false,
  error: null,
  // Parameters Components
  themeColors: {
    bgColor: '#EAE7DC',
    textColor: '#4A4A45',
    accentColor: '#E85A4F'
  },
  recipeRequest: null,
  // AI Response
  recipeResponse: null,
  saveRecipeData: null
}


export const ACTIONS = {
  GET_INGREDIENTS_USER: "GET_INGREDIENTS_USER",
  DELETE_INGREDIENTS_USER: "DELETE_INGREDIENTS_USER",
  ADD_INGREDIENTS_USER: "ADD_INGREDIENTS_USER",
  SET_ACTIVE_RECIPE: "SET_ACTIVE_RECIPE",
  SET_RECIPES: "SET_RECIPES",
  SET_RECIPE_INGREDIENTS: "SET_RECIPE_INGREDIENTS",
  REQUEST_RECIPE: "REQUEST_RECIPE",
  IS_LOADING: "IS_LOADING",
  ERROR: "ERROR",
  DARK_MODE: "DARK_MODE",
  SET_RECIPE_RESPONSE: "SET_RECIPE_RESPONSE",
  SAVE_RECIPE: "SAVE_RECIPE",
  CLEAR_RECIPE_RESPONSE: "CLEAR_RECIPE_RESPONSE"
}

export function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.GET_INGREDIENTS_USER:
      return {
        ...state,
        ingredientList: action.payload,
      }
    case ACTIONS.DELETE_INGREDIENTS_USER:
      return {
        ...state,
        deleteIngredientState: action.payload,
      }
    case ACTIONS.ADD_INGREDIENTS_USER:
      return {
        ...state,
        addIngredientState: action.payload,
      }

    // Actions to handle Recipe Components
    case ACTIONS.SET_ACTIVE_RECIPE:
      return {
        ...state,
        activeRecipe: action.payload
      }

    case ACTIONS.SET_RECIPES:
      return {
        ...state,
        recipes: action.payload
      }
    case ACTIONS.SET_RECIPE_INGREDIENTS:
      return {
        ...state,
        recipeIngredients: action.payload
      }

    case ACTIONS.IS_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }

    case ACTIONS.ERROR:
      return {
        ...state,
        error: action.payload
      }

    case ACTIONS.REQUEST_RECIPE:
      return {
        ...state,
        requestRecipe: action.payload
      }

    case ACTIONS.SET_RECIPE_RESPONSE:
      return {
        ...state,
        recipeResponse: action.payload
      }

    case ACTIONS.CLEAR_RECIPE_RESPONSE:
      return {
        ...state,
        recipeResponse: null
      }

      case ACTIONS.SAVE_RECIPE:
        return {
          ...state,
          saveRecipeData: action.payload,
          isLoading: true,
          error: null,
        };
      
    case ACTIONS.SAVE_RECIPE_SUCCESS:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
        isLoading: false,
      };
    case ACTIONS.SAVE_RECIPE_FAILURE:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}

const useApplicationData = () => {

  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  // fetch ingredients from backend
  useEffect(() => {
    fetch(`${API_CALL_URL}ingredients/${userId}`)
      .then((res) => res.json())
      .then((data) => dispatch({ type: ACTIONS.GET_INGREDIENTS_USER, payload: data }))
  }, [state.deleteIngredientState, state.addIngredientState]);

  // delete an ingredient from backend 
  useEffect(() => {
    if (state.deleteIngredientState) {
      const ingredientId = state.deleteIngredientState;
      fetch(`${API_CALL_URL}ingredients/${userId}/${ingredientId}`, {
        method: 'DELETE'
      })
        .then(() => dispatch({ type: ACTIONS.DELETE_INGREDIENTS_USER, payload: null }))
    }
  }, [state.deleteIngredientState])

  // add an ingredient to backend
  useEffect(() => {
    if (state.addIngredientState) {
      const ingredient = state.addIngredientState;
      console.log("ingredient", ingredient)
      fetch(`${API_CALL_URL}ingredients/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ingredient)
      })
        .then(() => dispatch({ type: ACTIONS.ADD_INGREDIENTS_USER, payload: null }))
    }
  }, [state.addIngredientState])

  // request recipe with parameters
  useEffect(() => {
    if (state.requestRecipe) {
      dispatch({ type: ACTIONS.IS_LOADING, payload: true });  
      fetch(`${API_CALL_URL}chat-gpt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.requestRecipe)
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json(); 
      })
      .then(data => {
        const aiRecipeObj = JSON.parse(data);
        dispatch({ type: ACTIONS.SET_RECIPE_RESPONSE, payload: aiRecipeObj });
      })
      .catch(error => {
        dispatch({ type: ACTIONS.ERROR, payload: error.message });
      })
      .finally(() => {
        dispatch({ type: ACTIONS.IS_LOADING, payload: false });  
        dispatch({ type: ACTIONS.REQUEST_RECIPE, payload: null }); // reset request state
      });
    }
  }, [state.requestRecipe]);

  const fetchRecipes = useCallback((userId) => {
    dispatch({ type: ACTIONS.IS_LOADING, payload: true })
    dispatch({ type: ACTIONS.ERROR, payload: null })
    fetch(`/api/saved-recipes/user/${userId}`)
      .then(response => response.json())
      .then(data => {
        dispatch({ type: 'SET_RECIPES', payload: data })
        dispatch({ type: ACTIONS.IS_LOADING, payload: false });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.ERROR, payload: err.message })
        dispatch({ type: ACTIONS.IS_LOADING, payload: false });
      });
  }, []);

  const fetchIngredients = useCallback((recipeId) => {
    // this is causing the page to reload
    dispatch({ type: ACTIONS.IS_LOADING, payload: true });
    dispatch({ type: ACTIONS.ERROR, payload: null })
    fetch(`/api/ingredients/recipe/${recipeId}`)
      .then(response => response.json())
      .then(data => {
        dispatch({ type: ACTIONS.SET_RECIPE_INGREDIENTS, payload: data });
        dispatch({ type: ACTIONS.IS_LOADING, payload: false });
      })
      .catch(err => {
        dispatch({ type: ACTIONS.ERROR, payload: err.message });
        dispatch({ type: ACTIONS.IS_LOADING, payload: false });
      });
  }, []);

  const saveRecipe = useCallback((recipeData) => {
    dispatch({ type: ACTIONS.IS_LOADING, payload: true });

    fetch(`${API_CALL_URL}saved-recipes/recipe/${recipeData.userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(recipeData.recipe)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save the recipe');
      }
      return response.json();
    })
    .then(data => {
      dispatch({ type: ACTIONS.SAVE_RECIPE_SUCCESS, payload: data });
      dispatch({ type: ACTIONS.IS_LOADING, payload: false });
    })
    .catch(error => {
      dispatch({ type: ACTIONS.SAVE_RECIPE_FAILURE, payload: error.message });
      dispatch({ type: ACTIONS.IS_LOADING, payload: false });
    });
  }, []);

  // fetch current view recipe from backend
  useEffect(() => {
    fetchRecipes(state.userId);
  }, [fetchRecipes, state.userId]);

  useEffect(() => {
    // console.log("Active recipe updated to:", state.activeRecipe);
    fetchIngredients(state.activeRecipe);
  }, [fetchIngredients, state.activeRecipe])

  useEffect(() => {
    if (state.saveRecipeData) {
      saveRecipe(state.saveRecipeData);
    }
  }, [state.saveRecipeData, saveRecipe]);
  

  // calling useApplicationData function return these functions that changes states
  return {
    state,
    dispatch
  };
}

export default useApplicationData;