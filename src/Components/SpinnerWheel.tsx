import { Component } from "solid-js";

interface Props{
    options: string[];
}

export const SpinnerWheel: Component<Props> = (props) => {
  
    const getConicGradient = (options: string[]): string => {
        let style = "from 0deg";

        for(let optionIndex = 0; optionIndex < options.length; optionIndex += 1){
            const randomColor = randomHsl();
            const previousAngle = optionIndex == 0 ? 0 : (optionIndex / options.length) * 360
            const currentAngle = ((optionIndex + 1) / options.length) * 360
            style = style + `, ${randomColor} ${previousAngle}deg ${currentAngle - 2}deg`;
        }

        return style;
    }

    const randomHsl = () => `hsla(${Math.random() * 360}, 100%, 50%, 1)`


    return <div style={
        {
            background:`radial-gradient(circle closest-side,transparent 73%,white 0),conic-gradient(${getConicGradient(props.options)})`,
            width: "100px",
            height: "100px"
        }
    }></div>;
};