import React, {useState, useEffect} from 'react';
import Select from 'react-select';
import {Label} from '../Form/FormComponents'

function Dropdown(props) {

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

    let startVal;
    if(props.val === false){
        startVal = false;
    }
    else{
        startVal = props.val || '-';
    }
    const [val, setVal] = useState(startVal);
    useEffect(() => { 
        props.changeDropdown(val, props.name);
    }, [val])

    return (

        <div className={props.extraClass}>
            <Label text={props.text} />
            <Select
                isDisabled={props.isDisabled || false}
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

export default Dropdown;