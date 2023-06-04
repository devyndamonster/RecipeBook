const discoveryDocs = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://docs.googleapis.com/$discovery/rest?version=v1'
];
const scopes = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';
let tokenClient;

const initializeGoogleApi = (callback: (accessToken: string) => void) => {
    loadGsi(
        () => loadGapi(
            () => googleSignIn(callback)))
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
        gapi.load('client', async () => {
            await gapi.client.init({
                discoveryDocs: discoveryDocs
            });
            callback();
        });
    };
    document.body.appendChild(script);
}

const googleSignIn = (callback) => {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            throw (resp);
        }

        callback(gapi.auth.getToken().access_token)
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

export default{
    initializeGoogleApi
}
