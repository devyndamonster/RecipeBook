import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { Recipe } from "../models/Recipe/Recipe";

const [recipes, setRecipes] = createStore<Recipe[]>([{name: "A Cool Recipe", ingredients: ["Do the thing", "Do it"], steps: [], stats: null}]);

const addRecipe = (recipe: Recipe) => {
    setRecipes([...recipes, recipe]);
}

const updateRecipe = (index: number, recipe: Recipe) => {
    const newRecipes = [...recipes];
    newRecipes[index] = recipe;
    setRecipes(newRecipes);
}

export default {
    recipes,
    addRecipe,
    updateRecipe
}

