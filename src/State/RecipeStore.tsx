import { createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";

const [recipes, setRecipes] = createStore<Recipe[]>([]);

const loadRecipeListingFromId = async () => {
    const listingFileId = DataFileStore.files.find(file => file.name == "RecipeBook.RecipeSheet").id;
    const listingContent = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: listingFileId,
        range: "A2:D"
    });

    const recipeListing: Recipe[] = listingContent.result.values.map(result => {
        return {
            id: result[0],
            name: result[1],
            stats: {
                estimatedTime: result[2],
                estimatedCalories: result[3]
            },
            ingredients: [],
            steps: []
        }
    });

    setRecipes(recipeListing);
}

const getDocContents = async (fileId: string): Promise<string> => {
    const response = await gapi.client.docs.documents.get({
        documentId: fileId
    });
    
    console.log(response);

    return response;
}

const updateDocForRecipe = async (fileId: string): Promise<void> => {

    let requests = [
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': 'Title of the recipe\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '\nIngredients:\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '- 1 tbsp chili powder\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '- 3 tbsp mustard powder\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '\nInstructions:\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '- Do it\n'
            }
        },
        {
            'insertText': {
                'location': {
                    'index': 1,
                },
                'text': '- Do it again\n'
            }
        },
    ];

    const response = await gapi.client.docs.documents.batchUpdate({
        documentId: fileId,
        requests: requests.reverse()
    });
    
    console.log(response);
}

const loadRecipeDetailsFromId = async (recipeId: string): Promise<Recipe> => {
    return null;
}

const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
}

const getRecipe = (id: string): Recipe => {
    return recipes.find(recipe => recipe.id == id);
}

const updateRecipe = (updatedRecipe: Recipe) => {
    const updatedRecipes = recipes.map(recipe => 
        recipe.id == updatedRecipe.id ? updatedRecipe : recipe);

    setRecipes(updatedRecipes);
}

export default {
    recipes,
    addRecipe,
    getRecipe,
    updateRecipe,
    loadRecipeListingFromId,
    getDocContents,
    updateDocForRecipe
}

