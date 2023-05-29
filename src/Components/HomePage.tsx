import { Component, createEffect, createSignal, onMount } from "solid-js";
import GoogleApi from "../Api/GoogleApi";
import { A } from "@solidjs/router";
import DataFileStore from "../State/DataFileStore";
import RecipeStore from "../State/RecipeStore";

async function loadRecipes() {
    await DataFileStore.loadFilesFromGoogle();
    await RecipeStore.loadRecipeListingFromId();
}

const HomePage: Component = () => {
  
    createEffect(() => {
        if(GoogleApi.signedIntoGoogle()){
            loadRecipes();
        }
    });

    return (
        <div class="flex flex-col">
            <div class="bg-slate-300 p-3 flex flex-row justify-between">
                <p class="text-4xl font-bold">Recipe Book</p>
                { GoogleApi.signedIntoGoogle() ? 
                    <button class="bg-slate-400 rounded-md p-1 text-xl" onClick={() => {}}>Signed In</button>:
                    <button class="bg-slate-400 rounded-md p-1 text-xl" onClick={() => GoogleApi.initializeGoogleApi()}>Sign In</button>
                }
            </div>

            { GoogleApi.signedIntoGoogle() &&
                <A 
                    class="flex flex-row bg-slate-100 hover:bg-slate-200 p-1 border-b border-slate-400 font-normal text-slate-950 cursor-pointer" 
                    href={"Recipes"}
                >
                    <div class="flex flex-col" >
                        <div class="p-2 text-xl">View Recipes</div>
                    </div>
                </A>
            }
        </div>
    );
};

export default HomePage;