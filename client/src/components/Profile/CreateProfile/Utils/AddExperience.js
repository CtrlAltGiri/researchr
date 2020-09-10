import React, { useState } from 'react';
import Accordian from '../../../General/Accordian/Accordian'
import { Title } from '../../../General/Form/FormComponents';
import {FormCheck} from '../../../../common/formValidators/cvValidator';

/// <summary> Template for all the adding experiences
/// Props: 
/// 1. requiredFields = contains all the fields that are compulsory.
/// 2. setMainObject = callback to the setState for all the experiences
/// 3. mainObject = all the cumulated experiences
/// 4. requiredFieldsDesc = names of the required fields to be displayed to the user.
/// 5. heading = Heading to be shown in the accordian.
/// 6. title = title of the section
/// 7. modal = the modal to be displayed
/// </summary>


/// TODO (Giri): They shouldn't have to press the submit button everytime to get 
/// update. So everytime innerForm is invoked, call some function that updates main.
function AddExperience(props) {

    const [formState, setFormState] = useState({});
    const [errorText, setshowError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(-1);

    function submitInnerForm(event) {
        event.preventDefault();
        if (FormCheck(props.requiredFields, formState)) {

            let retVal = props.formValidator(formState);
            if (retVal === true) {
                if (editMode === -1) {
                    props.setMainObject([...props.mainObject, formState]);
                }
                else {
                    let tempVar = [...props.mainObject];
                    tempVar[editMode] = formState;
                    props.setMainObject(tempVar)

                }
                closeModal({});
            }
            else {
                setshowError(retVal);
            }
        }
        else {
            setshowError('Please enter all required fields')
        }
    }

    function changeInputEvent(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        setFormState({ ...formState, [name]: value })
    }

    function changeInput(event, anotherChange = undefined) {
        anotherChange !== undefined ?
            setFormState({ ...formState, ...anotherChange }) :
            changeInputEvent(event);
    }

    function editExperience(item, index) {
        setEditMode(index)
        setFormState(item);
        setModalOpen(true);
    }

    function deleteExperience(index) {
        let tempVar = [...props.mainObject];
        if (index > -1) {
            tempVar.splice(index, 1);
        }
        props.setMainObject(tempVar);
        setFormState({})
    }

    function closeModal(event) {
        setModalOpen(false);
        setEditMode(-1);
        setFormState({});
        setshowError('');
    }

    function updateTags(newTags) {
        setFormState({ ...formState, ['tags']: newTags })
    }

    function changeDropdown(newDropdown, name) {
        changeInput({}, {
            [name]: newDropdown
        })
    }

    const ModalComponent = props.modal;

    return (
        <div className={props.extraClass}>
            <Title text={props.title} />
            {
                props.mainObject.length > 0 ?
                    <Accordian
                        mainObject={props.mainObject}
                        heading={props.heading}
                        description={props.shownFields}
                        labels={props.shownFieldsDesc}
                        editCallBack={editExperience}
                        deleteCallBack={deleteExperience}
                    />
                    : ""
            }

            <button className="flex focus:outline-none" onClick={(e) => setModalOpen(true)}>
                <svg className="svg-icon" viewBox="0 0 20 20">
                    <path fill="none" d="M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z"></path>
                </svg>
            </button>

            {modalOpen && <ModalComponent
                submitInnerForm={submitInnerForm}
                changeInput={changeInput}
                errorText={errorText}
                modalOpen={modalOpen}
                closeModal={closeModal}
                setModalOpen={setModalOpen}
                formState={formState}
                updateTags={updateTags}
                changeDropdown={changeDropdown}
            />}

        </div>
    );
}

export default AddExperience;