import { Accessor, Component, JSXElement, createContext, createSignal, onMount, useContext } from "solid-js";
import GoogleApi from "../Api/GoogleApi";
import { loadFilesFromGoogle } from "../Api/DataFileManagement";
import { createStore } from "solid-js/store";
import { DataFile } from "../Models/Data/DataFile";

const GoogleAuthContext = createContext<GoogleAuthContextStore>();

type GoogleAuthContextStore = [Accessor<boolean>, Accessor<string>, DataFile[]]

export const GoogleAuthContextProvider: Component<{children?: JSXElement}> = (props) => {

	const [isSignedInToGoogle, setIsSignedInToGoogle] = createSignal(false);
	const [accessToken, setAccessToken] = createSignal('');
	const [googleFiles, setGoogleFiles] = createStore<DataFile[]>([])

	const context: GoogleAuthContextStore = [
		isSignedInToGoogle,
		accessToken,
		googleFiles
	]

	onMount(() => {
		console.log(`Mounting google auth context. Access Token ${accessToken()}`)
		if(!isSignedInToGoogle()){
			GoogleApi.initializeGoogleApi((token) => {
				loadFilesFromGoogle().then((files) => {
					console.log("Loaded data files");
					console.log(files);
					setGoogleFiles(files);
					setAccessToken(token);
					setIsSignedInToGoogle(true);
				})
			})
		}
	})

	return (
		<GoogleAuthContext.Provider value={context}>
			{props.children}
		</GoogleAuthContext.Provider>
	);
};

export function useGoogleAuth() { return useContext(GoogleAuthContext); }