import { Component } from "solid-js";
import { Recipe } from "../Models/Recipe/Recipe";
import { A } from "@solidjs/router";

interface Props{
    recipe: Recipe;
}

const RecipePreview: Component<Props> = (props) => {
  
  return (
    <A 
      class="flex flex-row bg-slate-100 hover:bg-slate-200 p-1 border-b border-slate-400 font-normal text-slate-950 cursor-pointer" 
      onClick={() => console.log("Wow!")}
      href={props.recipe.id}
      >
        <div class="flex flex-col" >
            <div class="">{props.recipe.name}</div>
            <div class="text-xs text-slate-500">{props.recipe.stats.estimatedCalories} Calories</div>
        </div>
    </A>
  )
};

export default RecipePreview;