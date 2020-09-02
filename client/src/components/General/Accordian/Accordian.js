import React, {useState} from 'react';
import './Accordian.css'

function Accordian(props) {

    const [checked, setChecked] = useState(false);

    return (
        <div className="">
            <div className="tab w-full overflow-hidden border-t">
                <input className="absolute opacity-0" id={props.uniqueNumber} type="radio" name="tabs" />
                <label className="block p-5 leading-normal cursor-pointer" htmlFor={props.uniqueNumber}>{props.heading}</label>
                <div className="tab-content overflow-hidden border-l-2 bg-grey-lightest border-indigo leading-normal">
                    <p className="p-5">{props.description}</p>
                </div>
            </div>
        </div>
    );
}

export default Accordian;