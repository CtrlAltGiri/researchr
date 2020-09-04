import React from 'react';
import './Dropdown.css'

function Dropdown(props) {

    return (
        <div className="dropdown relative">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center outline-none">
                <span className="mr-1">{props.name}</span>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                {props.menuItems.map((item, index) => {
                    return (<li key= {props.uniqueName + index} ><a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap cursor-pointer" name={props.uniqueName} onClick={(e) => props.setDropdown(e, item)} href="#">{item}</a></li>)
                })}
            </ul>
        </div>
    )
}

export default Dropdown;