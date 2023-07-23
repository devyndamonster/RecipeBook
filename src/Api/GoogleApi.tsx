const scopes = 'https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive';

const initializeGoogleApi = (callback: (accessToken: string) => void) => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = () => {
        const tokenClient = google.accounts.oauth2.initTokenClient({
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
