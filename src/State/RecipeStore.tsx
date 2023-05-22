import { createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";

const [recipes, setRecipes] = createStore<Recipe[]>([
    {name: "A Cool Recipe", ingredients: ["Do the thing", "Do it"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {name: "A Cool Recipe 2", ingredients: ["Do the thing", "Do it"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {name: "A Cool Recipe 3", ingredients: ["Do the thing", "Do it"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {name: "A Cool Recipe 4", ingredients: ["Do the thing", "Do it"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}}
]);

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

