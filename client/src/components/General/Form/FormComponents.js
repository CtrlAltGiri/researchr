import React from 'react';

function TealButton(props) {
    return (
        <button className={`text-white bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg ${props.extraClass}`}
            onClick={props.submitForm}
            type={props.type}
        >
            {props.text}
        </button>
    );
}

function Error(props) {

    return (
        <p className="text-red-500 text-2xl">{props.text}</p>
    )
}

function Title(props) {

    return (<p className="mb-4 text-xl text-gray-900 font-medium title-font">{props.text}</p>)
}

function Label(props) {
    return (<p className="text-l text-gray-700 px-1 mb-1 font-medium">{props.text}</p>);
}

function TextField(props) {
    return (
        <div className={props.extraClass}>
            <Label text={props.text} />
            <input type="text" onChange={props.onChange} className={`outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2 ${props.fieldExtraClass}`} name={props.name} value={props.value || ''} />
        </div>
    );
}

function Checkbox(props) {
    return (
        <div className={props.extraClass}>
            <input onChange={props.onChange} id={props.ID} type="checkbox" name={props.name} className={`mx-2 ${props.checkboxExtraClass}`} defaultChecked={props.value}></input>
            <label htmlFor={props.ID} className="text-gray-900 cursor-pointer">{props.text}</label>
        </div>
    )
}


export { Error, Label, TealButton, TextField, Title, Checkbox };