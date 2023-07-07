import { Component, For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import { A, useParams } from '@solidjs/router';
import { useRecipes } from '../State/RecipesContextProvider';
import { useGoogleAuth } from '../State/GoogleAuthContextProvider';
import { loadRecipeDetailsFromDoc } from '../Api/RecipeManagement';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlinePlus, AiOutlineMinus } from 'solid-icons/ai'
import { produce } from 'solid-js/store';
import { Recipe } from '../Models/Recipe/Recipe';

type RecipeUpdater<T extends any[]> = (...args: T) => void;

const RecipeComponent: Component = () => {

    const [isEditing, setIsEditing] = createSignal(false);
    const params = useParams();
    const {recipes, setRecipes} = useRecipes();
    const {accessToken} = useGoogleAuth();

    const loadedRecipe = () => recipes.find(r => r.id == params.id);

    onMount(async () => {
        if(loadedRecipe() == null){
            return;
        }

        let recipeDetails = await loadRecipeDetailsFromDoc(loadedRecipe().id, accessToken());
        setRecipes(r => r.id == params.id, r => ({...r, ingredients: recipeDetails.ingredients, steps: recipeDetails.recipeSteps}));
    });

    function updateRecipe<T extends any[]>(action: (recipe: Recipe, ...args: T) => void): RecipeUpdater<T> {
        return (...args: T) => {
            setRecipes(
                produce((r) => {
                    let recipe = r[recipes.findIndex(r => r.id == params.id)];
                    action(recipe, ...args);
                })
            );
        };
    };

    const setStepTitle = updateRecipe((recipe: Recipe, updatedTitle: string, stepIndex: number) => {
        recipe.steps[stepIndex].title = updatedTitle;
    });

    const setInstructionText = updateRecipe((recipe: Recipe, updatedText: string, stepIndex: number, instructionIndex: number) => {
        recipe.steps[stepIndex].instructions[instructionIndex] = updatedText;
    });

    const moveInstructionUp = updateRecipe((recipe: Recipe, stepIndex: number, instructionIndex: number) => {
        if(instructionIndex > 0){
            let instructions = recipe.steps[stepIndex].instructions;
            [instructions[instructionIndex - 1], instructions[instructionIndex]] = [instructions[instructionIndex], instructions[instructionIndex - 1]]
        }
    });

    const moveInstructionDown = updateRecipe((recipe: Recipe, stepIndex: number, instructionIndex: number) => {
        let instructions = recipe.steps[stepIndex].instructions;
        if(instructionIndex < instructions.length - 1){
            [instructions[instructionIndex + 1], instructions[instructionIndex]] = [instructions[instructionIndex], instructions[instructionIndex + 1]]
        }
    });

    const removeInstruction = updateRecipe((recipe: Recipe, stepIndex: number, instructionIndex: number) => {
        let instructions = recipe.steps[stepIndex].instructions;
        if(instructions.length > 1){
            instructions.splice(instructionIndex, 1);
        }
        else{
            instructions[instructionIndex] = ""
        }
    });

    const addInstruction = updateRecipe((recipe: Recipe, stepIndex: number, instructionIndex: number) => {
        let instructions = recipe.steps[stepIndex].instructions;
        instructions.splice(instructionIndex + 1, 0, "");
    });

    const moveStepUp = updateRecipe((recipe: Recipe, stepIndex: number) => {
        if(stepIndex > 0){
            let steps = recipe.steps;
            [steps[stepIndex - 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex - 1]]
        }
    });

    const moveStepDown = updateRecipe((recipe: Recipe, stepIndex: number) => {
        let steps = recipe.steps;
        if(stepIndex < steps.length - 1){
            [steps[stepIndex + 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex + 1]]
        }
    });

    const removeStep = updateRecipe((recipe: Recipe, stepIndex: number) => {
        let steps = recipe.steps;
        if(steps.length > 1){
            steps.splice(stepIndex, 1);
        }
        else{
            steps[stepIndex] = {title:"", instructions:[""]}
        }
    });

    const addStep = updateRecipe((recipe: Recipe, stepIndex: number) => {
        let steps = recipe.steps;
        steps.splice(stepIndex + 1, 0, {title: "", instructions: [""]});
    });

    const addIngredient = updateRecipe((recipe: Recipe, ingredientIndex: number) => {
        recipe.ingredients.splice(ingredientIndex + 1, 0, "");
    });

    const removeIngredient = updateRecipe((recipe: Recipe, ingredientIndex: number) => {
        recipe.ingredients.splice(ingredientIndex, 1);
    });

    const updateIngredientText = updateRecipe((recipe: Recipe, ingredientIndex: number, text: string) => {
        recipe.ingredients[ingredientIndex] = text;
    });

    const moveIngredientUp = updateRecipe((recipe: Recipe, ingredientIndex: number) => {
        if(ingredientIndex > 0){
            let ingredients = recipe.ingredients;
            [ingredients[ingredientIndex - 1], ingredients[ingredientIndex]] = [ingredients[ingredientIndex], ingredients[ingredientIndex - 1]]
        }
    });

    const moveIngredientDown = updateRecipe((recipe: Recipe, ingredientIndex: number) => {
        if(ingredientIndex < recipe.ingredients.length - 1){
            let ingredients = recipe.ingredients;
            [ingredients[ingredientIndex + 1], ingredients[ingredientIndex]] = [ingredients[ingredientIndex], ingredients[ingredientIndex + 1]]
        }
    });

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
                        {(ingredient, ingredientIndex) => 
                            <Switch>
                                <Match when={isEditing()}>
                                    <div class="flex flex-row my-1 border-slate-700 border-2">
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => addIngredient(ingredientIndex())}>
                                            <AiOutlinePlus fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => removeIngredient(ingredientIndex())}>
                                            <AiOutlineMinus fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveIngredientDown(ingredientIndex())}>
                                            <AiOutlineArrowDown fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveIngredientUp(ingredientIndex())}>
                                            <AiOutlineArrowUp fill='white'/>
                                        </button>
                                        <input class="w-full m-0" value={ingredient} onChange={event => updateIngredientText(ingredientIndex(), event.target.value)}/>
                                    </div>
                                </Match>
                                <Match when={!isEditing()}>
                                    <li>
                                        {ingredient}
                                    </li>
                                </Match>
                            </Switch>
                            
                        }
                    </For>
                </ul>
                
                <h2 class="text-lg">Instructions</h2>
                <For each={loadedRecipe().steps}>
                    {(step, stepIndex) =>
                        <div class="bg-slate-300 flex-grow p-3 rounded-md mb-1">
                            <Switch>
                                <Match when={isEditing()}>
                                    <div class="flex flex-row my-1 border-slate-700 border-2">
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => addStep(stepIndex())}>
                                            <AiOutlinePlus fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => removeStep(stepIndex())}>
                                            <AiOutlineMinus fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveStepDown(stepIndex())}>
                                            <AiOutlineArrowDown fill='white'/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveStepUp(stepIndex())}>
                                            <AiOutlineArrowUp fill='white'/>
                                        </button>
                                        <input class="w-full m-0" value={step.title} onChange={event => setStepTitle(event.target.value, stepIndex())}/>
                                    </div>
                                    <hr class="my-1 bg-slate-700" style={{height: "2px"}}/>
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
                                                <div class="flex flex-row my-1 border-slate-700 border-2">
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => addInstruction(stepIndex(), instructionIndex())}>
                                                        <AiOutlinePlus fill='white'/>
                                                    </button>
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => removeInstruction(stepIndex(), instructionIndex())}>
                                                        <AiOutlineMinus fill='white'/>
                                                    </button>
                                                    <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={() => moveInstructionDown(stepIndex(), instructionIndex())}>
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