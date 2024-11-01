import React from 'react';
import ReactModal from 'react-modal';
import { TextField, Title, TealButton, Error, CloseButton, TextArea } from '../../../../General/Form/FormComponents';
import Dropdown from '../../../../General/Dropdown/Dropdown';
import { colleges, degrees, branches, yog } from '../../../../../common/data/collegeData';
import TagInput from '../../../../General/TagInput/TagInput';

function CollegeModal(props) {

    ReactModal.setAppElement(document.getElementById('root'));
    const isDropdownDisabled = props.editObject === 0;
    return (
        <ReactModal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
        >
            <div className="flex flex-col w-full">
                <div className="flex flex-col">

                    <div className="flex flex-row justify-between">
                        <Title text="Enter details of your university experience" />
                        <CloseButton onClick={(e) => props.closeModal(e)} />
                    </div>

                    <Dropdown
                        text="College"
                        required={true}
                        changeDropdown={props.changeDropdown}
                        name="college"
                        val={isDropdownDisabled ? props.defaultValues.college : props.formState.college}
                        placeholder="College"
                        extraClass="mb-8"
                        fieldExtraClass="w-full md:w-1/2"
                        options={colleges}
                        isDisabled={isDropdownDisabled}
                    />

                    <div className="flex flex-col md:flex-row mb-8">

                        <Dropdown
                            val={isDropdownDisabled ? props.defaultValues.degree : props.formState.degree}
                            name="degree"
                            required={true}
                            options={degrees}
                            changeDropdown={props.changeDropdown}
                            placeholder="Degree"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Degree"
                            isDisabled={isDropdownDisabled}
                        />

                        <Dropdown
                            val={isDropdownDisabled ? props.defaultValues.branch : props.formState.branch}
                            name="branch"
                            required={true}
                            options={branches}
                            changeDropdown={props.changeDropdown}
                            placeholder="Branch"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Branch of Study"
                            isDisabled={isDropdownDisabled}
                        />

                        <Dropdown
                            val={isDropdownDisabled ? props.defaultValues.yog.toString() : props.formState.yog}
                            name="yog"
                            required={true}
                            options={yog}
                            changeDropdown={props.changeDropdown}
                            placeholder="YOG"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Year of Graduation"
                            isDisabled={isDropdownDisabled}
                        />

                        <TextField
                            text="CGPA"
                            required={true}
                            onChange={props.changeInput}
                            name="cgpa"
                            value={props.formState.cgpa}
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                        />

                    </div>

                    <TextArea
                        name="experience"
                        value={props.formState.experience}
                        extraClass="mb-8"
                        text="Description"
                        onChange={props.changeInput}
                    />

                    <TagInput
                        text="Enter coursework"
                        extraClass="flex flex-col w-full md:w-3/5"
                        fieldExtraClass="w-full"
                        updateTags={props.updateTags}
                        chosenTags={props.formState.coursework}    
                        noSuggestions={true}
                        heading="Chosen coursework"
                        name="coursework"
                    />

                    <TealButton
                        type="submit"
                        extraClass="flex mx-auto mt-6"
                        text="Add"
                        submitForm={(e) => props.submitInnerForm(e)}
                    />
                    <Error text={props.errorText} />
                </div>
            </div>
        </ReactModal>
    );
}

export default CollegeModal;