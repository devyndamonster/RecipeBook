import { Component, For } from "solid-js";
import RecipePreview from "./RecipePreview";
import { useRecipes } from "../State/RecipesContextProvider";
import { A } from "@solidjs/router";

const RecipeList: Component = () => {

    const [recipes, setRecipes, actions] = useRecipes();

    return (
        <div class="flex flex-col">
            <For each={recipes}>
                {(recipe) => {
                    return <RecipePreview recipe={recipe}></RecipePreview>
                }}
            </For>

            <div class="flex flex-row gap-1 m-1">
                <A class="bg-slate-700 text-slate-50 p-1 rounded-sm text-center" href="/">Go Back</A>
                <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => { actions.createNewRecipe()}}> Add Recipe </button>
            </div>
        </div>
    );
};
  
export default RecipeList;