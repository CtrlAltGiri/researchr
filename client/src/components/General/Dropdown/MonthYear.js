import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Label } from '../Form/FormComponents';
import { retMonthOptions, retYearOptions} from './DateOptions';

// changeInput, date, name, extraClass
function MonthYear(props) {

    const monthOptions = retMonthOptions();
    const yearOptions = retYearOptions(props.onlyFuture);

    let finalDate = props.date;
    if(typeof(finalDate) === typeof('')){
        finalDate = new Date(finalDate.substr(3,4),finalDate.substr(0,2));
    }

    const [month, setMonth] = useState((finalDate && monthOptions[finalDate.getMonth()] && monthOptions[finalDate.getMonth()].value) || '-')
    const [year, setYear] = useState( (finalDate && finalDate.getFullYear()) || '-')

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

    // make this useEffect()
    useEffect(function updateProps() {
        if (month !== '-' && year !== '-') {
            let date = month + "/" + year.toString();
            props.onChange(date, props.name);
        }
    },[month, year])

    return (
        <div className={props.extraClass}>
            <Label text={props.text} required={props.required}/>
            <div className={props.innerClass}>

                <Select
                    className={props.fieldExtraClass}
                    styles={customStyles}
                    value={monthOptions.find(item => item.value === month)}
                    onChange={(newMonth) => { setMonth(newMonth.value);}}
                    options={monthOptions}
                    placeholder={"Month"}
                />

                <Select
                    className={props.fieldExtraClass}
                    styles={customStyles}
                    value={yearOptions.find(item => item.value === year)}
                    onChange={(newYear) => { setYear(newYear.value);}}
                    options={yearOptions}
                    placeholder={"Year"}
                />

            </div>
        </div>
    )
}

export default MonthYear;