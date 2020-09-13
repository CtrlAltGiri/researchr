import React from 'react';
import Dropdown from "../../../General/Dropdown/Dropdown";
import { Title, TextField } from '../../../General/Form/FormComponents';

function School(props) {

    function changeDropdown(newItem, name) {
        props.setSchoolState({ ...props.school, [name]: newItem });
    }

    function changeSchoolInput(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        props.setSchoolState({ ...props.school, [name]: value });
    }


    return (
        <div className="w-full">
            <Title text={'School'} />
            <div className="flex flex-row flex-wrap mb-16">
                <div className="flex flex-row flex-wrap w-full md:w-1/2 justify-around">
                    <TextField
                        text="10th Score"
                        onChange={changeSchoolInput}
                        name="grade10"
                        value={props.school.grade10}
                        extraClass="w-full md:w-1/3 mb-4"
                        fieldExtraClass="w-full"
                    />

                    <Dropdown
                        val={props.school.scoring10}
                        name={"scoring10"}
                        options={[{ value: "CGPA", label: "CGPA" }, { value: "Percentage", label: "Percentage" }]}
                        changeDropdown={changeDropdown}
                        placeholder="Scoring"
                        extraClass="flex flex-col mx-0 md:mx-16 w-full md:w-1/3 mb-8"
                        fieldExtraClass="w-full"
                        text="Class 10 Scoring"
                    />
                </div>
                <div className="flex flex-row flex-wrap w-full md:w-1/2 justify-around">
                    <TextField
                        text="12th Score"
                        onChange={changeSchoolInput}
                        name="grade12"
                        value={props.school.grade12}
                        extraClass="w-full md:w-1/3 mb-4"
                        fieldExtraClass="w-full"
                    />

                    <Dropdown
                        val={props.school.scoring12}
                        name={"scoring12"}
                        options={[{ value: "CGPA", label: "CGPA" }, { value: "Percentage", label: "Percentage" }]}
                        changeDropdown={changeDropdown}
                        placeholder="Scoring"
                        extraClass="flex flex-col mx-0 md:mx-16 w-full md:w-1/3 mb-8"
                        text="Class 12 Scoring"
                    />
                </div>
            </div>
        </div>
    )
}

export default School;