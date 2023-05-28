import { Component, createSignal, onMount } from "solid-js";
import GoogleApi from "../Api/GoogleApi";
import { A } from "@solidjs/router";

async function createSheet() {
    let response = await gapi.client.sheets.spreadsheets.create({
        resource: {
            properties:{
                title: "TestSpreadSheetAgain"
            }
        }
    });

    

    console.log(response);
}

async function listAllFiles() {

    console.log(gapi.client)

    let response = await gapi.client.drive.files.list();

    console.log(response);
}

const HomePage: Component = () => {
  
    return (
        <div class="flex flex-col">
            <div class="bg-slate-300 p-3 flex flex-row justify-between">
                <p class="text-4xl font-bold">Recipe Book</p>
                { GoogleApi.signedIntoGoogle() ? 
                    <button class="bg-slate-400 rounded-md p-1 text-xl" onClick={() => {}}>Signed In</button>:
                    <button class="bg-slate-400 rounded-md p-1 text-xl" onClick={() => GoogleApi.initializeGoogleApi()}>Sign In</button>
                }
            </div>

            <A 
                class="flex flex-row bg-slate-100 hover:bg-slate-200 p-1 border-b border-slate-400 font-normal text-slate-950 cursor-pointer" 
                href={"Recipes"}
            >
                <div class="flex flex-col" >
                    <div class="p-2 text-xl">View Recipes</div>
                </div>
            </A>

            <button onClick={() => listAllFiles()}>List all files</button>
        </div>
    );
};

export default HomePage;