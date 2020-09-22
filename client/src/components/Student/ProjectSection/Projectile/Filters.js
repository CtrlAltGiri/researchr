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
        <div className="px-16 self-end w-full md:w-1/4 z-50">
            <Dropdown
                changeDropdown={changeDropdown}
                name="dropdown"
                val={dept}
                placeholder="Department"
                extraClass=""
                fieldExtraClass="w-fu"
                options={branches}
            />

        </div>
    )
}

export default Filters;