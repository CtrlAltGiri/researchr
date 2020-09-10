import React from 'react';
import ReactModal from 'react-modal';
import '../../../Header/svg.css'
import { TextField, Title, Label, TealButton, Error } from '../../../General/Form/FormComponents';
import Dropdown from '../../../General/Dropdown/Dropdown';
import {colleges, degrees, branches, yog} from '../../../../common/data/collegeData';

function CollegeModal(props) {

    return (
        <ReactModal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
        >
            <div className="flex flex-col w-full">
                <form className="flex flex-col" onSubmit={props.submitInnerForm}>

                    <div className="flex flex-row justify-between">
                        <Title text="Enter details of your university experience" />
                        <button name="close" className="pr-4 focus:outline-none" onClick={(e) => { props.closeModal(e) }}><svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                        </svg></button>
                    </div>

                    <Dropdown
                        text="College"
                        changeDropdown={props.changeDropdown}
                        name="college"
                        val={props.formState.college}
                        placeholder="College"
                        extraClass="mb-8"
                        fieldExtraClass="w-full md:w-1/2"
                        options={colleges}
                    />

                    <div className="flex flex-col md:flex-row mb-8">

                        <Dropdown
                            val={props.formState.degree}
                            name="degree"
                            options={degrees}
                            changeDropdown={props.changeDropdown}
                            placeholder="Degree"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Degree"
                        />

                        <Dropdown
                            val={props.formState.branch}
                            name="branch"
                            options={branches}
                            changeDropdown={props.changeDropdown}
                            placeholder="Branch"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Branch of Study"
                        />

                        <Dropdown
                            val={props.formState.yog}
                            name="yog"
                            options={yog}
                            changeDropdown={props.changeDropdown}
                            placeholder="YOG"
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                            text="Year of Graduation"
                        />

                        <TextField
                            text="CGPA"
                            onChange={props.changeInput}
                            name="cgpa"
                            value={props.formState.cgpa}
                            extraClass="w-full md:w-1/4 mb-2 md:mb-0"
                            fieldExtraClass="w-full md:w-3/4"
                        />

                    </div>

                    <div className="mb-8">
                        <Label text="Description" />
                        <textarea
                            onChange={props.changeInput}
                            className="p-2 min-w-full outline-none focus:border-teal-500 border-2 rounded-lg min-h-1/4"
                            name="experience"
                            value={props.formState.experience}
                        />
                    </div>

                    <div className="mb-8">
                        <Label text="Coursework (seperate subjects with commas)" />
                        <textarea
                            onChange={props.changeInput}
                            className="p-2 min-w-full outline-none focus:border-teal-500 border-2 rounded-lg min-h-1/4"
                            name="coursework"
                            value={props.formState.coursework}
                        />
                    </div>

                    <TealButton
                        type="submit"
                        extraClass="flex mx-auto mt-6"
                        text="Add"
                        submitForm={(e) => props.submitInnerForm(e)}
                    />
                    <Error text={props.errorText} />
                </form>
            </div>
        </ReactModal>
    );
}

export default CollegeModal;