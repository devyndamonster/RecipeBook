import { Component, createSignal, onMount } from "solid-js";
import GoogleApi from "../Api/GoogleApi";

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

const HomePage: Component = () => {
  
    return (
        <>
            <div>Homepage</div>
            <div>Signed in? {GoogleApi.signedIntoGoogle().toString()}</div>
            <button onClick={() => GoogleApi.initializeGoogleApi()}>Sign In!</button>
            <button onClick={() => createSheet()}>Create!</button>
        </>
    );
};

export default HomePage;