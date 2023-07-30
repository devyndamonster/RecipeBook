import { Component, createSignal } from "solid-js";
import { SpinnerWheel } from "./SpinnerWheel";
import { useRecipes } from "../State/RecipesContextProvider";
import { A } from "@solidjs/router";

export const WheelOfMeals: Component<{}> = (props) => {

	const [recipes] = useRecipes();
	const [selectedText, setSelectedText] = createSignal("");
	const [selectedId, setSelectedId] = createSignal("");
	
	const onSelectionChanged = (option: string) => {
		const recipe = recipes.find(r => r.id == option);
		setSelectedText(recipe.name);
		setSelectedId(recipe.id);
	}

	return (
		<div class="flex flex-col m-10 items-center">
			<span class="text-5xl mb-5">
				Wheel Of Meals!
			</span>
			<SpinnerWheel options={recipes.map(r => r.id)} onCurrentOptionChanged={onSelectionChanged}/>
			<div class="mt-5">
				<A href={`/Recipes/${selectedId()}`}>{selectedText()}</A>
			</div>
		</div>
	);
};