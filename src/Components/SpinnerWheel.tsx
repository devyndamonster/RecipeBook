import { Accessor, Component, Show, createEffect, createSignal } from "solid-js";

interface Props{
    options: string[];
    onCurrentOptionChanged: (option: string) => void;
}

export const SpinnerWheel: Component<Props> = (props) => {
  
    const [spinTimeRemaining, setSpinTimeRemaining] = createSignal(0);
	const [spinSpeed, setSpinSpeed] = createSignal(0);
	const [currentRotation, setCurrentRotation] = createSignal(0);
    const [colors, setColors] = createSignal<string[]>([]);
    const [currentOption, setCurrentOption] = createSignal("");

    const getConicGradient = (options: string[]): string => {
        let style = "from 0deg";

        for(let optionIndex = 0; optionIndex < options.length; optionIndex += 1){
            const randomColor = colors()[optionIndex];
            const previousAngle = optionIndex == 0 ? 0 : (optionIndex / options.length) * 360
            const currentAngle = ((optionIndex + 1) / options.length) * 360
            style = style + `, ${randomColor} ${previousAngle}deg ${currentAngle - 2}deg`;
        }

        return style;
    }

    const updateRotation = () => {
		if(spinTimeRemaining() > 0){
			setSpinTimeRemaining(spinTimeRemaining() - 0.05);
		}
		else if(spinTimeRemaining() <= 0 && spinSpeed() > 0){
			let newSpinSpeed = spinSpeed() - 0.075;
			if(newSpinSpeed < 0) newSpinSpeed = 0;
			setSpinSpeed(newSpinSpeed);
		}
        if(spinSpeed() > 0){
            let newRotation = currentRotation() + spinSpeed();
            if (newRotation > 360) newRotation = 0;

            const selectionIndex = Math.min(Math.floor((newRotation / 360) * props.options.length), props.options.length - 1);
            const selectedOption = props.options[selectionIndex];
            if(currentOption() != selectedOption){
                setCurrentOption(selectedOption);
                props.onCurrentOptionChanged(selectedOption);
            }

            setCurrentRotation(newRotation);
        }
	}

	const spinTheWheel = () => {
		setSpinTimeRemaining(5 + (5 * Math.random()));
		setSpinSpeed(10 + (5 * Math.random()));
	}

	setInterval(updateRotation, 10);

    createEffect(() => {
        setColors(props.options.map(option => randomHsl()))
    })

    const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`

    return (
        <>
            <div class="w-80 h-80 relative">
                <div style={
                    {
                        background:`conic-gradient(${getConicGradient(props.options)})`,
                        "border-radius":"50%",
                        width: "100%",
                        height: "100%",
                        transform: `rotate(${currentRotation()}deg)`
                    }
                }></div>
                <Show when={spinSpeed() <= 0}>
                    <div onClick={spinTheWheel} class="absolute inset-0 mx-auto my-auto flex items-center justify-center text-white text-6xl">
                        Spin!
                    </div>
                </Show>
            </div>
            
        </>
    );
};