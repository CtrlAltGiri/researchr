import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Label } from '../Form/FormComponents';

// changeInput, date, name, extraClass
function MonthYear(props) {

    let tempMonth, finalDate = props.date ? new Date(props.date.split("/")[1], props.date.split("/")[0]) : undefined;
    if(finalDate){
        tempMonth = finalDate.getMonth();
        if(tempMonth < 10){
            tempMonth = "0" + tempMonth;
        }
        else{
            tempMonth = tempMonth.toString();
        }
    }
    const [month, setMonth] = useState((finalDate && tempMonth) || '-')
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

    const monthOptions = [{ value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
    ]

    const last10 = (new Date()).getFullYear() - 10;
    const yearOptions = [];
    for (let i = 0; i <= 10; i++) {
        yearOptions.push({ value: last10 + i, label: (last10 + i).toString() })
    }

    // make this useEffect()
    useEffect(function updateProps() {
        if (month !== '-' && year !== '-') {
            let date = month + "/" + year.toString();
            props.onChange(date, props.name);
        }
    },[month, year])

    return (
        <div className={props.extraClass}>
            <Label text={props.text} />
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