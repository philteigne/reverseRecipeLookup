import React from 'react';
import Pantry from './Components/Pantry';
import { Redirect } from "react-router-dom";
import CreateRecipe from './Components/CreateRecipe.jsx';
import RecipeListView from './Components/RecipeListView';
import RecipeFullView from './Components/RecipeFullView';
import ButtonAppBar from './Components/Navigation';
import { applicationContext } from './hooks/applicationContext';
import useApplicationData from './hooks/customHook';
import Parameters from './Components/Parameters';
import { Stack } from '@mui/material'; 
import HomePage from './Components/HomePage.jsx';
import RecipeResponseView from './Components/RecipeResponseView.jsx';
import Loading from './Components/Loading.jsx';
import SignInSide from './Components/Login.jsx';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline'


import { ThemeProvider} from '@mui/material/styles'
import customColorScheme from './styles/MuiTheme';
import './assets/fonts/fonts.css';


function App() {
  const { state, dispatch } = useApplicationData();

  function PrivateRoute({ component: Component, auth, ...rest }) {
    return (
      <Route {...rest} render={(props) => (
        auth ? <Component {...props} />
      : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
      )} />
    );
  }

  return (
    <ThemeProvider theme={customColorScheme(state.themeColors)}>
      <CssBaseline />
        <Router>
          <applicationContext.Provider value={{state, dispatch}}>
            <div>
              <ButtonAppBar />
              <Switch>
                <Route path='/' exact component={HomePage}/>
                <Route path='/login' component={SignInSide} />

                <PrivateRoute path="/create-recipe" component={CreateRecipe} auth={state.isLoggedIn} />

                <Router path="/view-recipe">
                  <Stack
                    direction="row"
                    justifyContent='center'
                    spacing={12}
                    >
                    <RecipeListView />
                    <RecipeFullView />
                  </Stack>
                </Router>
              </Switch>
            </div>
          </applicationContext.Provider>
        </Router>
    </ThemeProvider>
  );
  
}

export default App;

