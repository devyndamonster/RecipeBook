import { Component, For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import { A, useParams } from '@solidjs/router';
import { useRecipes } from '../State/RecipesContextProvider';
import { useGoogleAuth } from '../State/GoogleAuthContextProvider';
import { loadRecipeDetailsFromDoc } from '../Api/RecipeManagement';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlinePlus, AiOutlineMinus } from 'solid-icons/ai'
import { Recipe } from '../Models/Recipe/Recipe';

const RecipeComponent: Component = () => {

    const [isEditing, setIsEditing] = createSignal(false);
    const params = useParams();
    const {recipes, setRecipe} = useRecipes();
    const {accessToken} = useGoogleAuth();

    const loadedRecipe = () => recipes().find(r => r.id == params.id);

    onMount(async () => {
        let loadedRecipe = recipes().find(r => r.id == params.id);

        if(loadedRecipe == null){
            return;
        }

        let recipeDetails = await loadRecipeDetailsFromDoc(loadedRecipe.id, accessToken());

        setRecipe({
            ...loadedRecipe,
            ingredients: recipeDetails.ingredients,
            steps: recipeDetails.recipeSteps,
        }, params.id)
    });

    const setStepTitle = (updatedTitle: string, stepIndex: number) => {
        const recipe = loadedRecipe();
        setRecipe({
            ...recipe,
            steps: recipe.steps.map((step, index) => index == stepIndex ? ({
                ...step,
                title: updatedTitle
            }) : step)
        }, params.id);
    }

    const setInstructionText = (updatedText: string, stepIndex: number, instructionIndex: number) => {
        const recipe = loadedRecipe();
        setRecipe({
            ...recipe,
            steps: recipe.steps.map((step, index) => index == stepIndex ? ({
                ...step,
                instructions: step.instructions.map((instruction, index) => index == instructionIndex ? updatedText : instruction)
            }) : step)
        }, params.id)
    }

    const moveInstructionUp = (stepIndex: number, instructionIndex: number) => {
        const recipe = loadedRecipe();
        setRecipe({
            ...recipe,
            steps: recipe.steps.map((step, index) => {
                if(index == stepIndex && instructionIndex > 0){
                    let instructions = [...step.instructions];
                    [instructions[instructionIndex - 1], instructions[instructionIndex]] = [instructions[instructionIndex], instructions[instructionIndex - 1]];

                    return {
                        ...step,
                        instructions: instructions
                    }
                }
                return step;
            })
        }, params.id)
    }

    return (
        <Show
            when={loadedRecipe() != null}
            fallback={<div>Loading...</div>}
        >
            <div class="flex flex-col p-10">
                <h1 class="text-xl mb-3">{loadedRecipe().name}</h1>

                <div class="flex flex-row mb-3">
                    <p class="mr-10"><b>Estimated Time:</b> {loadedRecipe().stats.estimatedTime} </p>
                    <p class="mr-10"><b>Estimated Calories:</b> {loadedRecipe().stats.estimatedCalories} </p>
                </div>

                <h2 class="text-lg">Ingredients</h2>
                <ul class="mb-3">
                    <For each={loadedRecipe().ingredients}>
                        {(ingredient) => 
                            <li>
                                {ingredient}
                            </li>
                        }
                    </For>
                </ul>
                
                <h2 class="text-lg">Instructions</h2>
                <For each={loadedRecipe().steps}>
                    {(step, stepIndex) =>
                        <div class="bg-slate-300 flex-grow p-3 rounded-md mb-1">

                            <Switch>
                                <Match when={isEditing()}>
                                    <input class="w-full m-0" value={step.title} onChange={event => setStepTitle(event.target.value, stepIndex())}/>
                                </Match>
                                <Match when={!isEditing()}>
                                    <h3>{step.title}</h3>
                                </Match>
                            </Switch>

                            <ul>
                                <For each={step.instructions}>
                                    {(instruction, instructionIndex) => 
                                        <Switch>
                                            <Match when={isEditing()}>
                                                <div class="flex flex-row my-1">
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                                        <AiOutlinePlus fill='white'/>
                                                    </button>
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                                        <AiOutlineMinus fill='white'/>
                                                    </button>
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                                        <AiOutlineArrowDown fill='white'/>
                                                    </button>
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveInstructionUp(stepIndex(), instructionIndex())}>
                                                        <AiOutlineArrowUp fill='white'/>
                                                    </button>
                                                    <input class="w-full m-0" value={instruction} onChange={event => setInstructionText(event.target.value, stepIndex(), instructionIndex())}/>
                                                </div>
                                                
                                            </Match>
                                            <Match when={!isEditing()}>
                                                <li>
                                                    {instruction}
                                                </li>
                                            </Match>
                                        </Switch>
                                    }
                                </For>
                            </ul>
                        </div>
                    }
                </For>

                <div class="flex flex-row gap-1">
                    <Switch>
                        <Match when={isEditing()}>
                            <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => setIsEditing(false)}> Save </button>
                        </Match>
                        <Match when={!isEditing()}>
                            <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => setIsEditing(true)}> Edit </button>
                        </Match>
                    </Switch>
                    <A class="bg-slate-700 text-slate-50 p-1 rounded-sm text-center" href="/Recipes">Go Back!</A>
                </div>
            </div>
        </Show>
    );

};
  
export default RecipeComponent;