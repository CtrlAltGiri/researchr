import React, { useState } from 'react';
import './Accordian.css'

function Accordian(props) {

    const [active, setActive] = useState("");

    return (
        <div className="w-full md:w-3/5 my-4 shadow-md">
            {props.college.map((college, index) => {
                return <Accordians
                    key={index}
                    uniqueNumber={"Accoridan" + index}
                    heading={college[props.heading]}
                    description={college[props.description]}
                    active={active}
                    setActive={setActive}
                />})
            }
        </div>
    );
}

function reverseActive(event, active, setActive) {
    let id = event.target.id;
    if (active != id) {
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
                    <p className="p-5">{props.description}</p>
                </div>
            </div>
        </div>
    );
}

export default Accordian;