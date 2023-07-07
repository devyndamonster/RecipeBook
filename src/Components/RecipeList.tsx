import { Component, For } from "solid-js";
import RecipePreview from "./RecipePreview";
import { useRecipes } from "../State/RecipesContextProvider";

const RecipeList: Component = () => {

    const {recipes} = useRecipes();

    return (
        <div class="bg-slate-600 flex flex-col">
            <For each={recipes}>
                {(recipe) => {
                    return <RecipePreview recipe={recipe}></RecipePreview>
                }}
            </For>
        </div>
    );
};
  
export default RecipeList;