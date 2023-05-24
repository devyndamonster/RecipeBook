import { createStore } from "solid-js/store";
import { Recipe } from "../Models/Recipe/Recipe";

const [recipes, setRecipes] = createStore<Recipe[]>([
    {id: "1", name: "A Cool Recipe", ingredients: ["3 cups of stuff", "2 tbsp of things"], steps: [
        {title: "Make the sauce", instructions: ["Do the thing", "Do it again"]}, 
        {title: "Make the sauce again", instructions: ["Do the thing", "Do it again"]}
    ], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {id: "2", name: "A Cool Recipe 2", ingredients: ["3 cups of stuff", "2 tbsp of things"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {id: "3", name: "A Cool Recipe 3", ingredients: ["3 cups of stuff", "2 tbsp of things"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}},
    {id: "4", name: "A Cool Recipe 4", ingredients: ["3 cups of stuff", "2 tbsp of things"], steps: [], stats: {estimatedCalories: 100, estimatedTime: 30}}
]);

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
    updateRecipe
}

