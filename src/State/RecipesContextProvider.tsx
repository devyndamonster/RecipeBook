import { Accessor, Component, JSXElement, Setter, createContext, createEffect, createSignal, onMount, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";
import { useGoogleAuth } from "./GoogleAuthContextProvider";
import { loadRecipeListingFromId } from "../Api/RecipeManagement";

const RecipesContext = createContext<RecipesContextStore>();

interface RecipesContextStore {
	recipes: Accessor<Recipe[]>;
	setRecipes: Setter<Recipe[]>
}

export const RecipesContextProvider: Component<{children?: JSXElement}> = (props) => {

	const [recipes, setRecipes] = createSignal<Recipe[]>([]);
    const [hasLoadedRecipes, setHasLoadedRecipes] = createSignal(false);
    const {isSignedInToGoogle, googleFiles} = useGoogleAuth();

	const context: RecipesContextStore = {
		recipes,
		setRecipes
	}

	createEffect(async () => {
        if(isSignedInToGoogle() && !hasLoadedRecipes()){
            const recipeSheetId = googleFiles.find(file => file.name == "RecipeBook.RecipeSheet").id;
            const recipes = await loadRecipeListingFromId(recipeSheetId);

            setRecipes(recipes);
            setHasLoadedRecipes(true);
        }
    })

	return (
		<RecipesContext.Provider value={context}>
			{props.children}
		</RecipesContext.Provider>
	);
};

export function useRecipes() { return useContext(RecipesContext); }