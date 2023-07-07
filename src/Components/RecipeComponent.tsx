import { Component, For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import { A, useParams } from '@solidjs/router';
import { useRecipes } from '../State/RecipesContextProvider';
import { useGoogleAuth } from '../State/GoogleAuthContextProvider';
import { loadRecipeDetailsFromDoc } from '../Api/RecipeManagement';
import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlinePlus, AiOutlineMinus } from 'solid-icons/ai'
import { produce } from 'solid-js/store';

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

    const setStepTitle = (updatedTitle: string, stepIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                recipe.steps[stepIndex].title = updatedTitle;
            })
        );
    }

    const setInstructionText = (updatedText: string, stepIndex: number, instructionIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                recipe.steps[stepIndex].instructions[instructionIndex] = updatedText;
            })
        );
    }

    const moveInstructionUp = (stepIndex: number, instructionIndex: number) => {
        setRecipes(
            produce((r) => {
                if(instructionIndex > 0){
                    let recipe = r[recipes.findIndex(r => r.id == params.id)];
                    let instructions = recipe.steps[stepIndex].instructions;
                    [instructions[instructionIndex - 1], instructions[instructionIndex]] = [instructions[instructionIndex], instructions[instructionIndex - 1]]
                }
            })
        );
    }

    const moveInstructionDown = (stepIndex: number, instructionIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let instructions = recipe.steps[stepIndex].instructions;
                if(instructionIndex < instructions.length - 1){
                    [instructions[instructionIndex + 1], instructions[instructionIndex]] = [instructions[instructionIndex], instructions[instructionIndex + 1]]
                }
            })
        );
    }

    const removeInstruction = (stepIndex: number, instructionIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let instructions = recipe.steps[stepIndex].instructions;
                if(instructions.length > 1){
                    instructions.splice(instructionIndex, 1);
                }
                else{
                    instructions[instructionIndex] = ""
                }
            })
        );
    }

    const addInstruction = (stepIndex: number, instructionIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let instructions = recipe.steps[stepIndex].instructions;
                instructions.splice(instructionIndex + 1, 0, "");
            })
        );
    }

    const moveStepUp = (stepIndex: number) => {
        setRecipes(
            produce((r) => {
                if(stepIndex > 0){
                    let recipe = r[recipes.findIndex(r => r.id == params.id)];
                    let steps = recipe.steps;
                    [steps[stepIndex - 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex - 1]]
                }
            })
        );
    }

    const moveStepDown = (stepIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let steps = recipe.steps;
                if(stepIndex < steps.length - 1){
                    [steps[stepIndex + 1], steps[stepIndex]] = [steps[stepIndex], steps[stepIndex + 1]]
                }
            })
        );
    }

    const removeStep = (stepIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let steps = recipe.steps;
                if(steps.length > 1){
                    steps.splice(stepIndex, 1);
                }
                else{
                    steps[stepIndex] = {title:"", instructions:[""]}
                }
            })
        );
    }

    const addStep = (stepIndex: number) => {
        setRecipes(
            produce((r) => {
                let recipe = r[recipes.findIndex(r => r.id == params.id)];
                let steps = recipe.steps;
                steps.splice(stepIndex + 1, 0, {title: "", instructions: [""]});
            })
        );
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
                                    <div class="flex flex-row my-1">
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                            <AiOutlinePlus fill='white' onClick={() => addStep(stepIndex())}/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                            <AiOutlineMinus fill='white' onClick={() => removeStep(stepIndex())}/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                            <AiOutlineArrowDown fill='white' onClick={() => moveStepDown(stepIndex())}/>
                                        </button>
                                        <button class="bg-slate-700 text-slate-50 mr-px px-2">
                                            <AiOutlineArrowUp fill='white'onClick={() => moveStepUp(stepIndex())}/>
                                        </button>
                                        <input class="w-full m-0" value={step.title} onChange={event => setStepTitle(event.target.value, stepIndex())}/>
                                    </div>
                                    <hr class="h-px my-3"/>
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