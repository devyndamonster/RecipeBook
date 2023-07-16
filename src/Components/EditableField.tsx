import { AiOutlineArrowDown, AiOutlineArrowUp, AiOutlineMinus, AiOutlinePlus } from "solid-icons/ai";
import { Component } from "solid-js";

interface Props {
    add: () => void;
    remove: () => void;
    moveUp: () => void;
    moveDown: () => void;
    value: string;
    onValueChange: (value: string) => void;
}

export const EditableField: Component<Props> = (props) => {
  
    return (
        <div class="flex flex-row my-1 border-slate-700 border-2">
            <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={props.add}>
                <AiOutlinePlus fill='white'/>
            </button>
            <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={props.remove}>
                <AiOutlineMinus fill='white'/>
            </button>
            <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={props.moveDown}>
                <AiOutlineArrowDown fill='white'/>
            </button>
            <button class="bg-slate-700 text-slate-50 mr-px px-2" onClick={props.moveUp}>
                <AiOutlineArrowUp fill='white'/>
            </button>
            <input class="w-full m-0" value={props.value} onChange={event => props.onValueChange(event.target.value)}/>
        </div>
    );
};