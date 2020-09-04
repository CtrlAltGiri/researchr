import React, { useState } from 'react';
import './Accordian.css'


///<summary>
/// Takes in heading, description as two parameters that can be called on the object sent. 
/// Takes in mainObject as the combination of all
///</summary>
function Accordian(props) {

    const [active, setActive] = useState("");

    return (
        <div className="w-full md:w-3/5 my-4 shadow-md">
            {props.mainObject.map((object, index) => {
                return <Accordians
                    values={object}
                    index={index}
                    uniqueNumber={props.heading + index}
                    heading={object[props.heading]}
                    description={props.description}
                    active={active}
                    setActive={setActive}
                    editCallBack={props.editCallBack}
                    deleteCallBack={props.deleteCallBack}
                    key={index}
                    labels={props.labels}
                />
            })
            }
        </div>
    );
}

function reverseActive(event, active, setActive) {
    let id = event.target.id;
    if (active !== id) {
        setActive(id)
    }
    else {
        event.target.checked = false;
        setActive("");
    }
}

function Accordians(props) {

    return (
        <div className="">
            <div className="tab w-full overflow-hidden border-t">
                <input className="absolute opacity-0" id={props.uniqueNumber} type="radio" name="tabs" onClick={(e) => reverseActive(e, props.active, props.setActive)} />
                <label className="block p-5 leading-normal cursor-pointer" htmlFor={props.uniqueNumber}>{props.heading}</label>
                <div className="tab-content overflow-hidden border-l-2 bg-grey-lightest border-indigo leading-normal">
                    <div className="p-5">{AccordianDescription(props.values, props.description, props.labels)}</div>
                    <div className="flex justify-around pb-4">
                        <button className="focus:outline-none" onClick={(e) => props.editCallBack(props.values, props.index)}>Edit</button>
                        <button className="text-red-500 focus:outline-none" onClick={(e) => props.deleteCallBack(props.index)}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function AccordianDescription(props, values, descValues){

    return(
        <div>
            {values.map((value, index) => {
                if(props[value] !== undefined && !(props[value].length === 1 && props[value][0] === '-')) //  check for '-' lol
                    return <p>{descValues[index] + ": " + props[value]}</p>
                else
                    return "";
            })}
        </div>
    );
}

export default Accordian;