import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {Label} from '../Form/FormComponents'

function Dropdown(props) {

    return (
        <div className="dropdown relative">
            <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center outline-none">
                <span className="mr-1">{props.name}</span>
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /> </svg>
            </button>
            <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                {props.menuItems.map((item, index) => {
                    return (<li key={props.uniqueName + index} ><a className="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap cursor-pointer" name={props.uniqueName} onClick={(e) => props.setDropdown(e, item)} href="#">{item}</a></li>)
                })}
            </ul>
        </div>
    )
}


function Dropdowns(props) {

    const customStyles = {
        control: (base, state) => ({
            ...base,
            boxShadow: state.isFocused ? 0 : 0,
            borderColor: state.isFocused ? '#2c7a7b' : base.borderColor,
            '&:hover': { borderColor: state.isFocused ? '#2c7a7b' : '#38b2ac' },
        }),

        option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#4fd1c5' : 'white',
            '&:hover': { backgroundColor: state.isFocused ? '#4fd1c5' : 'white' },
            color: state.isSelected ? 'black' : 'black'
        }),

        container: base => ({
            ...base,
            flex: 1
        }),
    };

    const [val, setVal] = useState(props.val || "-");
    useEffect(() => { 
        props.changeDropdown(val, props.name);
    }, [val])

    return (

        <div className={props.extraClass}>
            <Label text={props.text} />
            <Select
                className={props.fieldExtraClass}
                styles={customStyles}
                value={props.options && props.options.find(item => item.value === val)}
                onChange={(newVal) => { setVal(newVal.value) }}
                options={props.options}
                placeholder={props.placeholder}
                components={{
                    IndicatorSeparator: () => null
                }}
            />
        </div>
    )

}

export default Dropdowns;