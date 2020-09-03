import React, { useState } from 'react';
import CollegeModal from './CollegeModal';
import Accordian from '../../../../General/Accordian/Accordian';
import { Title } from '../../../../General/Form/FormComponents'

function College(props) {

    const [formState, setFormState] = useState({});
    const [showError, setshowError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(-1);

    function submitInnerForm(event) {
        event.preventDefault();
        if (formState.hasOwnProperty('college') && formState.hasOwnProperty('branch') && formState.hasOwnProperty('degree') && formState.hasOwnProperty('yog') && formState.hasOwnProperty('cgpa')) {
            // New University being added, nothing is edited.
            if (editMode === -1) {
                props.setCollegeState([...props.college, formState]);
            }
            else {
                let tempVar = props.college;
                tempVar[editMode] = formState;
                props.setCollegeState(tempVar)
            }
            setModalOpen(false);
            setshowError(false);
            setFormState({});
        }
        else {
            setshowError(true)
        }
    }

    function changeInput(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        setFormState({ ...formState, [name]: value });
    }

    function editCollege(item, index) {
        setEditMode(index)
        setFormState(item);
        setModalOpen(true);
    }

    function deleteCollege(index) {
        let tempVar = [...props.college];
        if (index > -1) {
            tempVar.splice(index, 1);
        }
        props.setCollegeState(tempVar);
        setFormState({})
    }

    return (
        <div>
            <Title text={'University'} />
            {
                props.college.length > 0 ?
                    <Accordian
                        mainObject={props.college}
                        heading={"college"}
                        description={["degree", "branch", "cgpa", "yog", "experience"]}
                        labels={["Degree", "Branch", "CGPA", "Year of Graduation", "Experiences"]}
                        editCallBack={editCollege}
                        deleteCallBack={deleteCollege}
                    />
                    : ""
            }

            <button className="flex focus:outline-none" onClick={(e) => setModalOpen(true)}>
                <svg className="svg-icon" viewBox="0 0 20 20">
                    <path fill="none" d="M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z"></path>
                </svg>
            </button>

            <CollegeModal
                submitInnerForm={submitInnerForm}
                changeInput={changeInput}
                showError={showError}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                formState={formState}
                setEditMode={setEditMode}
            />

        </div>
    );
}

export default College;