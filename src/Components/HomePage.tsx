import { Component, createEffect, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import { useGoogleAuth } from "../State/GoogleAuthContextProvider";

const HomePage: Component = () => {
  
    const {isSignedInToGoogle} = useGoogleAuth();

    return (
        <div class="flex flex-col">
            <div class="bg-slate-300 p-3 flex flex-row justify-between">
                <p class="text-4xl font-bold">Recipe Book</p>
            </div>

            { isSignedInToGoogle() &&
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