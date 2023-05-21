import { Component, For } from "solid-js";
import RecipeStore from "../State/RecipeStore";
import RecipeComponent from "./RecipeComponent";

const RecipeList: Component = () => {

    return (
        <For each={RecipeStore.recipes}>
            {(recipe, index) => {
                return <RecipeComponent recipe={recipe} index={index()}></RecipeComponent>
            }}
        </For>
    );
};
  
export default RecipeList;