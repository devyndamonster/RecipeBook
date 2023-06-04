import { Component, For, Show, createSignal, onMount } from 'solid-js';
import { Recipe } from '../Models/Recipe/Recipe';
import { A, useParams } from '@solidjs/router';
import { useRecipes } from '../State/RecipesContextProvider';


const RecipeComponent: Component = () => {

    const [recipe, setRecipe] = createSignal<Recipe>(null);
    const params = useParams();
    const {recipes} = useRecipes();

    onMount(async () => {
        let loadedRecipe = recipes.find(r => r.id == params.id);

        if(loadedRecipe == null){
            //load the recipe
        }

        setRecipe({...loadedRecipe})
    });

    const addIngredient = (ingredient: string) => {
        const updatedRecipe = {...recipe(), ingredients: [...recipe().ingredients, ingredient]}
        setRecipe(updatedRecipe);
    }

    return (
        <Show
            when={recipe() != null}
            fallback={<div>Loading...</div>}
        >
            <div class="flex flex-col p-10">
                <h1 class="text-xl mb-3">{recipe().name}</h1>

                <div class="flex flex-row mb-3">
                    <p class="mr-10"><b>Estimated Time:</b> {recipe().stats.estimatedTime} </p>
                    <p class="mr-10"><b>Estimated Calories:</b> {recipe().stats.estimatedCalories} </p>
                </div>

                <h2 class="text-lg">Ingredients</h2>
                <ul class="mb-3">
                    <For each={recipe().ingredients}>
                        {(ingredient) => 
                            <li>
                                {ingredient}
                            </li>
                        }
                    </For>
                </ul>
                
                <h2 class="text-lg">Instructions</h2>
                <For each={recipe().steps}>
                    {(step) =>
                        <div class="bg-slate-300 flex-grow p-3 rounded-md mb-1">
                            <h3>{step.title}</h3>
                            <ul>
                                <For each={step.instructions}>
                                    {(instruction) => 
                                        <li>
                                            {instruction}
                                        </li>
                                    }
                                </For>
                            </ul>
                        </div>
                    }
                </For>

                <div class="flex flex-row gap-1">
                    <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => addIngredient("New Ingredient!")}> Add Ingredient </button>
                    <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => {}}> Save! </button>
                    <A class="bg-slate-700 text-slate-50 p-1 rounded-sm text-center" href="/Recipes">Go Back!</A>
                </div>
            </div>
        </Show>
    );

};
  
export default RecipeComponent;