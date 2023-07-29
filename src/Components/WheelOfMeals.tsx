import { Component, createSignal } from "solid-js";
import { SpinnerWheel } from "./SpinnerWheel";
import { useRecipes } from "../State/RecipesContextProvider";

export const WheelOfMeals: Component<{}> = (props) => {

	const [recipes] = useRecipes();

	return (
		<>
			<SpinnerWheel options={recipes.map(r => r.name)}/>
		</>
	);
};