import { Component, For } from 'solid-js';
import { Recipe } from '../Models/Recipe/Recipe';
import RecipeStore from '../State/RecipeStore';

interface Props{
    recipe: Recipe;
    index: number;
}

const RecipeComponent: Component<Props> = (props) => {

    return (
        <>
            <For each={props.recipe.ingredients}>
                {(ingredient) => {
                    return <div>{ingredient}</div>
                }}
            </For>
            <button class="bg-slate-700 text-slate-50 p-1 rounded-sm" onClick={() => RecipeStore.updateRecipe(props.index, {name: "", ingredients:[...props.recipe.ingredients, "yup"], steps:[], stats:null})}> Add Step </button>
        </>
        
    );

};
  
export default RecipeComponent;