const discoveryDocs = [
    'https://sheets.googleapis.com/$discovery/rest?version=v4',
    'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest',
    'https://docs.googleapis.com/$discovery/rest?version=v1'
];
const scopes = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';
let tokenClient;

const initializeGoogleApi = (callback: (accessToken: string) => void) => {
    loadGsi(callback)
}

const loadGsi = (callback: (accessToken: string) => void) => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: scopes,
            callback: (response) => {
                console.log("Loaded google auth client");
                console.log(response);
                callback(response.access_token);
            }
        });
        tokenClient.requestAccessToken({prompt: 'consent'});
    };
    document.body.appendChild(script);
}

export default{
    initializeGoogleApi
}
