import { Component } from 'solid-js';
import RecipeList from './Components/RecipeList';
import { Route, Routes } from '@solidjs/router';
import RecipeComponent from './Components/RecipeComponent';
import HomePage from './Components/HomePage';
import { GoogleAuthContextProvider } from './State/GoogleAuthContextProvider';
import { RecipesContextProvider } from './State/RecipesContextProvider';
import { WheelOfMeals } from './Components/WheelOfMeals';

const App: Component = () => {

	return (
		<GoogleAuthContextProvider>
			<RecipesContextProvider>
				<Routes>
					<Route path="Recipes" component={RecipeList} />
					<Route path="WheelOfMeals" component={WheelOfMeals} />
					<Route path="Recipes/:id" component={RecipeComponent} />
					<Route path="/" component={HomePage} />
				</Routes>
			</RecipesContextProvider>
		</GoogleAuthContextProvider>
	);
};

export default App;
