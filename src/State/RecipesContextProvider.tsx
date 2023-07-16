import { Accessor, Component, JSXElement, Setter, createContext, createEffect, createSignal, onMount, useContext } from "solid-js";
import { SetStoreFunction, createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";
import { useGoogleAuth } from "./GoogleAuthContextProvider";
import { loadRecipeListingFromId } from "../Api/RecipeManagement";
import { appendRow } from "../Api/GoogleSheetsClient";

const RecipesContext = createContext<RecipesContextStore>();

type RecipesContextStore = [
	Recipe[], 
	SetStoreFunction<Recipe[]>,
	{  
		createNewRecipe: () => void;
	}
]

export const RecipesContextProvider: Component<{children?: JSXElement}> = (props) => {

	const [recipes, setRecipes] = createStore<Recipe[]>([]);
    const [hasLoadedRecipes, setHasLoadedRecipes] = createSignal(false);
    const [isSignedInToGoogle, accessToken, googleFiles] = useGoogleAuth();

	const createNewRecipe = async (): Promise<void> => {
		const recipeSheetId = googleFiles.find(file => file.name == "RecipeBook.RecipeSheet").id;
		const parentFolderId = googleFiles.find(file => file.name == "RecipeBook").id;

		const response = await gapi.client.drive.files.create({
			resource: {
				name: "New Recipe",
				mimeType: "application/vnd.google-apps.document",
				parents: [parentFolderId]
			},
			fields: 'id'
		})
	
		const values = [response.result.id, "New Recipe", 0, 0];

		const newRecipe: Recipe = {
			id: response.result.id,
			name: "New Recipe",
			stats: {
				estimatedTime: 0,
				estimatedCalories: 0,
			},
			ingredients: [],
			steps: []
		};

		setRecipes([...recipes, newRecipe]);

		console.log("Added recipe");
		console.log(recipes);
	
		await appendRow(recipeSheetId, accessToken(), values)
	}

	const context: RecipesContextStore = [
		recipes,
		setRecipes,
		{
			createNewRecipe
		}
	]

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