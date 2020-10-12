import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { LabelMaxChars } from '../Form/FormComponents';
import { retDayOptions, retMonthOptions, retYearOptions } from './DateOptions'

// changeInput, date, name, extraClass
function DayMonthYear(props) {
    
    const dayOptions = retDayOptions();
    const monthOptions = retMonthOptions();
    const yearOptions = retYearOptions(props.onlyFuture);

    let finalDate = props.date;
    if(finalDate !== undefined && typeof(finalDate) === typeof('')){
        finalDate = new Date(finalDate);
    }

    function isValidDate(dateObject){
        if(!dateObject){
            return false;
        }
        return new Date(dateObject).toString() !== 'Invalid Date';
    }

    const [day, setDay] = useState((isValidDate(finalDate) && dayOptions[finalDate.getDate() - 1].value) || '-')
    const [month, setMonth] = useState((isValidDate(finalDate) && (monthOptions[finalDate.getMonth()].value)) || '-')
    const [year, setYear] = useState( (isValidDate(finalDate) && finalDate.getFullYear()) || '-')

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

    useEffect(() => {
        if (day !== '-' && month !== '-' && year !== '-') {
            let date = new Date(year, month - 1, day);
            props.onChange(date, props.name);  
        }
    },[day, month, year])

    return (
        <div className={props.extraClass}>
            <LabelMaxChars text={props.text} required={props.required} />
            <div className={props.innerClass}>

                <Select
                    isDisabled={props.isDisabled || false}
                    className={props.fieldExtraClass}
                    styles={customStyles}
                    value={dayOptions.find(item => item.value === day)}
                    onChange={(newDay) => { setDay(newDay.value); }}
                    options={dayOptions}
                    placeholder="Day"
                />

                <Select
                    isDisabled={props.isDisabled || false}
                    className={props.fieldExtraClass}
                    styles={customStyles}
                    value={monthOptions.find(item => item.value === month)}
                    onChange={(newMonth) => { setMonth(newMonth.value);}}
                    options={monthOptions}
                    placeholder={"Month"}
                />

                <Select
                    isDisabled={props.isDisabled || false}
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

export default DayMonthYear;