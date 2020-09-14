import React, { useState } from 'react';
import Accordian from '../../../../General/Accordian/Accordian'
import { AddButton, Title } from '../../../../General/Form/FormComponents';
import {FormCheck} from '../../../../../common/formValidators/cvValidator';

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
    const [errorText, setshowError] = useState('');
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
        let name;
        if(props.heading === 'college'){
            name = 'coursework';
        }
        else{
            name = 'tags';
        }

        setFormState({ ...formState, [name]: newTags })
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
            
            <AddButton
                onClick={(e) => setModalOpen(true)}
            />

            <ModalComponent
                submitInnerForm={submitInnerForm}
                changeInput={changeInput}
                errorText={errorText}
                modalOpen={modalOpen}
                closeModal={closeModal}
                setModalOpen={setModalOpen}
                formState={formState}
                updateTags={updateTags}
                changeDropdown={changeDropdown}
            />
        </div>
    );
}

export default AddExperience;