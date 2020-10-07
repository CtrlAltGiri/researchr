import React, {useState} from 'react';
import './toggle.css';

function Toggle(props) {

    return (
        <div className={props.extraClass}>
            <label htmlFor={props.name || "toggleA"} className={props.labelClass}>
                <div className="relative">
                    <input id={props.name || "toggleA"} type="checkbox" className="hidden" onChange={e => {(props.onClick && props.onClick())}} checked={props.checked}/>
                    <div className="toggle__line w-10 h-4 bg-gray-400 rounded-full shadow-lg"/>
                    <div className="toggle__dot absolute w-6 h-6 bg-white rounded-full shadow-lg" />
                </div>
                <div className="ml-3 text-gray-700 font-medium">
                    {props.text}
                </div>
            </label>
        </div>
    );
}


export default Toggle;