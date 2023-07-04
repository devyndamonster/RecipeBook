import { Accessor, Component, JSXElement, Setter, createContext, createEffect, createSignal, onMount, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";
import { useGoogleAuth } from "./GoogleAuthContextProvider";
import { loadRecipeListingFromId } from "../Api/RecipeManagement";

const RecipesContext = createContext<RecipesContextStore>();

interface RecipesContextStore {
	recipes: Accessor<Recipe[]>;
	setRecipes: Setter<Recipe[]>;
	setRecipe: (updatedRecipe: Recipe, recipeId: string) => void;
}

export const RecipesContextProvider: Component<{children?: JSXElement}> = (props) => {

	const [recipes, setRecipes] = createSignal<Recipe[]>([]);
    const [hasLoadedRecipes, setHasLoadedRecipes] = createSignal(false);
    const {isSignedInToGoogle, googleFiles} = useGoogleAuth();

	const setRecipe = (updatedRecipe: Recipe, recipeId: string) => {
		setRecipes(recipes().map(recipe => recipe.id == recipeId ? {
            ...updatedRecipe
        } : recipe));
	}

	const context: RecipesContextStore = {
		recipes,
		setRecipes,
		setRecipe
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