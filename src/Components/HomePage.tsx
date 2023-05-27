import { Component, createSignal, onMount } from "solid-js";

const apiKey = 'AIzaSyCnsGd28E2NjwVukGnubyXJqORoZocBPPg';
const clientId = '129661224051-6lhghpag29cd6jc7cd0qgmeq8frmvf0v.apps.googleusercontent.com';
const discoveryDoc = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const scopes = 'https://www.googleapis.com/auth/spreadsheets';
let tokenClient;


const loadGsi = () => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => gisLoaded();
    document.body.appendChild(script);
}

const loadGapi = () => {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => gapiLoaded();
    document.body.appendChild(script);
}

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes,
        callback: (response) => {}
    });
}

async function initializeGapiClient() {
    await gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: [discoveryDoc],
    });
  }


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


function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }

        await createSheet();
    };

    if (gapi.client.getToken() === null) {
        // Prompt the user to select a Google Account and ask for consent to share their data
        // when establishing a new session.
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        // Skip display of account chooser and consent dialog for an existing session.
        tokenClient.requestAccessToken({prompt: ''});
    }
}



const HomePage: Component = () => {
  
    onMount(async () => {
        loadGsi();
        loadGapi();
    });

    return (
        <>
            <div>Homepage</div>
            <button onClick={() => handleAuthClick()}>Sign In!</button>
            <button onClick={() => {}}>Create!</button>
        </>
    );
};

export default HomePage;