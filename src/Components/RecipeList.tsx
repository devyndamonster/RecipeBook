import { Component, For } from "solid-js";
import RecipeStore from "../State/RecipeStore";
import RecipePreview from "./RecipePreview";

const RecipeList: Component = () => {

    return (
        <div class="bg-slate-600 flex flex-col">
            <For each={RecipeStore.recipes}>
                {(recipe) => {
                    return <RecipePreview recipe={recipe}></RecipePreview>
                }}
            </For>
        </div>
    );
};
  
export default RecipeList;