import { Component } from "solid-js";
import { Recipe } from "../Models/Recipe/Recipe";

interface Props{
    recipe: Recipe;
}

const RecipePreview: Component<Props> = (props) => {
  
  return (
    <div class="flex flex-row bg-slate-100 p-1 border-b border-slate-400 font-normal text-slate-950">
        <div class="flex flex-col">
            <div class="">{props.recipe.name}</div>
            <div class="text-xs text-slate-500">{props.recipe.stats.estimatedCalories} Calories</div>
        </div>
    </div>
  )
};

export default RecipePreview;