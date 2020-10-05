import React, { useState } from 'react';
import Dropdown from '../../../General/Dropdown/Dropdown';
import { branches } from '../../../../common/data/collegeData';
 
function Filters(props) {

    const [dept, setDept] = useState('')

    function changeDropdown(newVal, name){
        setDept(newVal);
        props.setFilter(newVal, "dept")
    }

    return (
        <div className="pl-8 md:pl-16 md:px-12 w-full md:w-1/4">
            <Dropdown
                changeDropdown={changeDropdown}
                name="dropdown"
                val={dept}
                placeholder="Department"
                extraClass=""
                fieldExtraClass="w-full"
                options={[{value:"-", label:"All"}].concat(branches)}
            />

        </div>
    )
}

export default Filters;