import { Component } from 'solid-js';
import RecipeList from './Components/RecipeList';
import { Route, Routes } from '@solidjs/router';
import RecipeComponent from './Components/RecipeComponent';
import HomePage from './Components/HomePage';
import { GoogleAuthContextProvider } from './State/GoogleAuthContextProvider';

const App: Component = () => {

	return (
		<GoogleAuthContextProvider>
			<Routes>
				<Route path="Recipes" component={RecipeList} />
				<Route path="Recipes/:id" component={RecipeComponent} />
				<Route path="/" component={HomePage} />
			</Routes>
		</GoogleAuthContextProvider>
	);
};

export default App;
