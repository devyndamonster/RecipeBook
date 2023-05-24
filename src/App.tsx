import { Component } from 'solid-js';
import RecipeList from './Components/RecipeList';
import { Route, Routes } from '@solidjs/router';
import RecipeComponent from './Components/RecipeComponent';

const App: Component = () => {

  return (
    <Routes>
      <Route path="Recipes" component={RecipeList}/>
      <Route path="Recipes/:id" component={RecipeComponent}/>
    </Routes>
  );
};

export default App;
