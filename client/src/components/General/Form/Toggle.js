import React, {useState} from 'react';
import './toggle.css';

function Toggle(props) {

    return (
        <div className="px-2 mx-8 w-full md:w-1/4">
            <label htmlFor="toogleA" className="flex justify-center items-center cursor-pointer">
                <div className="relative">
                    <input id="toogleA" type="checkbox" className="hidden" onChange={e => {(props.onClick && props.onClick());}}/>
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