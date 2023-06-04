import { Accessor, Component, JSXElement, createContext, createSignal, onMount, useContext } from "solid-js";
import GoogleApi from "../Api/GoogleApi";
import { loadFilesFromGoogle } from "../Api/DataFileManagement";
import { createStore } from "solid-js/store";
import { DataFile } from "../Models/Data/DataFile";

const GoogleAuthContext = createContext<GoogleAuthContextStore>();

interface GoogleAuthContextStore {
	isSignedInToGoogle: Accessor<boolean>;
	accessToken: Accessor<string>;
	googleFiles: DataFile[];
}

export const GoogleAuthContextProvider: Component<{children?: JSXElement}> = (props) => {

	const [isSignedInToGoogle, setIsSignedInToGoogle] = createSignal(false);
	const [accessToken, setAccessToken] = createSignal('');
	const [googleFiles, setGoogleFiles] = createStore<DataFile[]>([])

	const context: GoogleAuthContextStore = {
		isSignedInToGoogle,
		accessToken,
		googleFiles
	}

	onMount(() => {
		if(!isSignedInToGoogle()){
			GoogleApi.initializeGoogleApi((token) => {
				setAccessToken(token);
				setIsSignedInToGoogle(true);

				loadFilesFromGoogle().then((files) => {
					console.log(files);
					setGoogleFiles(files);
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