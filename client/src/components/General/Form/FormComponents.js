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

function RedButton(props) {
    return (
        <button className={`text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-600 rounded text-lg ${props.extraClass}`}
            onClick={props.submitForm}
            type={props.type}
        >
            {props.text}
        </button>
    );
}

function Error(props) {

    return (
        <p className={`text-red-500 text-xl ${props.extraClass}`}>{props.text}</p>
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
            <input type="text" onChange={props.onChange} className={`outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2 ${props.fieldExtraClass}`} name={props.name} value={props.value || ''} disabled={props.disabled}/>
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

function CloseButton(props) {
    return (
        <button name="close" className="pr-4 focus:outline-none" onClick={props.onClick}>
            <svg className="svg-icon" viewBox="0 0 20 20">
                <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
            </svg></button>
    );
}

function BackButton(props) {
    return (<button onClick={props.onClick} className={`focus:outline-none ${props.extraClass}`}>
        <svg class="svg-icon" viewBox="0 0 20 20">
            <path d="M11.739,13.962c-0.087,0.086-0.199,0.131-0.312,0.131c-0.112,0-0.226-0.045-0.312-0.131l-3.738-3.736c-0.173-0.173-0.173-0.454,0-0.626l3.559-3.562c0.173-0.175,0.454-0.173,0.626,0c0.173,0.172,0.173,0.451,0,0.624l-3.248,3.25l3.425,3.426C11.911,13.511,11.911,13.789,11.739,13.962 M18.406,10c0,4.644-3.763,8.406-8.406,8.406S1.594,14.644,1.594,10S5.356,1.594,10,1.594S18.406,5.356,18.406,10 M17.521,10c0-4.148-3.373-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.148,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.148,17.521,10"></path>
        </svg>
    </button>);
}

function TextArea(props) {

    return (
        <div className={props.extraClass}>
            <Label text={props.text} />
            <textarea
                rows={props.rows || 5}
                onChange={props.onChange}
                className={`p-2 min-w-full outline-none focus:border-teal-500 border-2 rounded-lg min-h-1/4 ${props.fieldExtraClass}`}
                name={props.name}
                value={props.value}
            />
        </div>
    )
}

function FavButton(props) {

    return <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
        </svg>
    </button>
}

function AddButton(props) {
    return (
        <button className={`flex focus:outline-none ${props.extraClass}`} onClick={props.onClick}>
            <svg className="svg-icon" viewBox="0 0 20 20">
                <path fill="none" d="M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z"></path>
            </svg>
        </button>
    );
}


export { Error, Label, TealButton, TextField, Title, Checkbox, CloseButton, TextArea, BackButton, RedButton, AddButton };