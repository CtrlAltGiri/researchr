import React, { useState } from 'react';
import Dropdown from "../../../../General/Dropdown/Dropdown";
import { Title, TextField } from '../../../../General/Form/FormComponents';

function School(props) {

    function changeDropdown(event, newItem) {
        props.setSchoolState({ ...props.school, [event.target.name]: newItem });
    }

    function changeSchoolInput(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        props.setSchoolState({ ...props.school, [name]: value });
    }


    return (
        <div>
            <Title text={'School'}/>
            <div className="flex flex-row flex-wrap mb-16 justify-around">
                <div className="flex flex-row">
                    <TextField
                        text="10th Score"
                        onChange={changeSchoolInput}
                        name="grade10"
                        value={props.school.grade10}
                    />

                    <div className="mb-16 md:mb-0 ml-8">
                        <p className="text-l text-gray-700 mb-1 font-medium">Scoring</p>
                        <Dropdown
                            name={props.school.scoring10}
                            uniqueName={"scoring10"}
                            menuItems={["CGPA", "Percentage"]}
                            setDropdown={changeDropdown}
                        />
                    </div>
                </div>
                <div className="flex flex-row">
                    <TextField
                        text="12th Score"
                        onChange={changeSchoolInput}
                        name="grade12"
                        value={props.school.grade12}
                    />

                    <div className="mb-16 md:mb-0 ml-8">
                        <p className="text-l text-gray-700 mb-1 font-medium">Scoring</p>
                        <Dropdown
                            name={props.school.scoring12}
                            uniqueName={"scoring12"}
                            menuItems={["CGPA", "Percentage"]}
                            setDropdown={changeDropdown}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default School;