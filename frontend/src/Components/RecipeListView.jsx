import React, { useContext } from "react";
import RecipeList from "./RecipeList";
import { Box, Typography, Paper, List, ListItem, ListItemText, Button } from "@mui/material";
import { applicationContext } from '../hooks/applicationContext';
import Loading from "./Loading";
import Error from "./Error";

function RecipeListView() {

  const { state } = useContext(applicationContext);
  const { recipes, isLoading, error } = state;

  if (isLoading) return <Loading />
  if (error) return <Error />

  return (
    <Box sx={{ width: 0.43 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', direction: 'row', marginRight: 4.2, marginBottom: 0.5 }}>
        <Typography variant="h1" component="h1" color="primary">&#8226; saved recipes</Typography>
      </Box>

      {recipes.length > 0 ? (
        <RecipeList />
      ):(
        <Typography variant="subtitle1" sx={{ textAlign: "center", my: 2 }}>
          No recipes found.
        </Typography>
      )}

    </Box>
  );
}

export default RecipeListView;
