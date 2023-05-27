import { createSignal } from "solid-js";

const discoveryDoc = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const scopes = 'https://www.googleapis.com/auth/spreadsheets';
let tokenClient;

const [signedIntoGoogle, setSignedIntoGoogle] = createSignal(false);

const initializeGoogleApi = () => {
    if(signedIntoGoogle()){
        return;
    }

    loadGsi(
        () => loadGapi(
            () => googleSignIn()))
}

const loadGsi = (callback) => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        console.log("Loaded script: " + import.meta.env.VITE_GOOGLE_CLIENT_ID)
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: scopes,
            callback: (response) => {}
        });
        callback();
    };
    document.body.appendChild(script);
}

const loadGapi = (callback) => {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {

        console.log(import.meta.env.VITE_GOOGLE_API_KEY)

        gapi.load('client', async () => {
            await gapi.client.init({
                apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
                discoveryDocs: [discoveryDoc],
            });

            callback();
        });
    };
    document.body.appendChild(script);
}

const googleSignIn = () => {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            setSignedIntoGoogle(false);
            throw (resp);
        }

        setSignedIntoGoogle(true);
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

export default{
    initializeGoogleApi,
    signedIntoGoogle
}
