import { Component, For, createSignal } from 'solid-js';
import { Recipe } from '../Models/Recipe/Recipe';
import RecipeStore from '../State/RecipeStore';
import { useParams } from '@solidjs/router';


const RecipeComponent: Component = () => {

    const params = useParams();
    const [recipe, setRecipe] = createSignal<Recipe>(RecipeStore.getRecipe(params.id));

    const addIngredient = (ingredient: string) => {
        const updatedRecipe = {...recipe(), ingredients: [...recipe().ingredients, ingredient]}
        setRecipe(updatedRecipe);
    }

    return (
        <>
            <For each={(recipe().ingredients)}>
                {(ingredient) => 
                    <li>
                        {ingredient}
                    </li>
                }
            </For>
            <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => addIngredient("New Ingredient!")}> Add Ingredient </button>
        </>
    );

};
  
export default RecipeComponent;