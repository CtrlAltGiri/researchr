import React, { useState, useRef } from 'react';
import { TextArea, TextField, TealButton, Error } from '../../General/Form/FormComponents';
import Modal from '../../General/Modal/Modal'
import TagInput from '../../General/TagInput/TagInput';
import DayMonthYear from '../../General/Dropdown/DayMonthYear';
import Dropdown from '../../General/Dropdown/Dropdown';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { projectValidator } from '../../../common/formValidators/profProjectValidator';
import DetailsTab from '../../Student/ProjectSection/ProjectPage/DetailsTab';

function DisplayList(props){
    const list = props.list;
    return (
        <div className={props.extraClass}>
            <p className="text-2xl font-medium">{props.text}</p>
            {list && list.map((p, index) => {
                return <li key={p + index} className='text-lg text-teal-700'>{p}</li>
            })}
        </div>
    );
}

function AddProject(props) {

    const [projDetails, setProjectDetails] = useState(props.projDetails || {});
    const [errorText, showError] = useState('');
    const [previewMode, setPreviewMode] = useState(false);
    let btnRef = useRef()
    let history = useHistory();

    function changeInput(event) {
        setProjectDetails({ ...projDetails, [event.target.name]: event.target.value });
    }

    function changeTags(newTags, name) {
        setProjectDetails({ ...projDetails, [name]: newTags })
        showError('');
    }

    function submitForm(event){
        event.preventDefault();

        // TODO (Giri): Please make sure they can't press button twice
        if(btnRef.current){
            btnRef.current.setAttribute("disabled", "true");
        }

        if (props.editMode) {
            axios.put('/api/professor/project/' + props._id, projDetails)
                .then(res => {
                    history.go(0);
                })
                .catch(err => {
                    showError(err.response.data)
                });
        }
        else {
            if(!projDetails.questionnaire){
                projDetails.questionnaire = [];
            }
            axios.post('/api/professor/projects', projDetails)
                .then(res => history.go(0))
                .catch(err => showError(err.response.data));
        }
    }

    function showPreview(event) {
        event.preventDefault();
        let retVal = projectValidator(projDetails, props.editMode);
        if (retVal !== true) {
            showError(retVal);
            return;
        }
        else {
            setPreviewMode(true);
        }
    }

    function closeModal(e) {
        showError('');
        props.closeModal(e);
    }

    return (
        !previewMode ?
            <Modal
                modalOpen={props.modalOpen}
                closeModal={closeModal}
                text={props.editMode ? (<p>Edit <span className="text-teal-600">{projDetails.name}</span></p>) : "Add a Project"}>

                <TextField
                    text="Project Headline"
                    extraClass="w-full my-4"
                    fieldExtraClass="w-full md:w-3/5"
                    onChange={changeInput}
                    name="name"
                    value={projDetails.name}
                    disabled={props.editMode}
                    maxChars={200}
                    required={true}
                />

                <TextArea
                    text="Description (Please include nature and scope of Project)"
                    extraClass="my-4"
                    onChange={changeInput}
                    name="desc"
                    value={projDetails.desc}
                    rows={10}
                    maxChars={1000}
                    required={true}
                />

                <TagInput
                    text="Skills / Prerequisites required"
                    extraClass="flex justify-center mx-auto flex-col"
                    fieldExtraClass="w-full md:3/5"
                    updateTags={changeTags}
                    chosenTags={projDetails.prereq}
                    maxNumberOfTags={10}
                    noSuggestions={false}
                    name="prereq"
                    heading="Chosen Prerequisites"
                    required={true}
                    toolTipId="prereq"
                    toolTipMessage="Please type in a skill and press the plus button / enter key."
                />

                <div className="flex flex-col md:flex-row mb-2 mt-4">
                    <DayMonthYear
                        name="startDate"
                        onChange={changeTags}
                        date={projDetails.startDate}
                        onlyFuture={true}
                        text="Project Start Date"
                        extraClass="w-full mb-8"
                        innerClass="flex"
                        fieldExtraClass="w-full md:w-3/4 mr-4 md:mr-12"
                        required={true}
                    />

                    <TextField
                        text="Number of Weeks"
                        extraClass="w-full md:w-1/3 mt-1 mb-4 md:mb-0"
                        fieldExtraClass="w-full"
                        onChange={changeInput}
                        name="duration"
                        value={projDetails.duration}
                        required={true}
                    />
                </div>

                <div className="flex flex-col md:flex-row mb-2 mt-4">
                    <DayMonthYear
                        name="applicationCloseDate"
                        onChange={changeTags}
                        date={projDetails.applicationCloseDate}
                        onlyFuture={true}
                        text="Application Close Date"
                        extraClass="w-full mb-8"
                        innerClass="flex"
                        fieldExtraClass="w-full md:w-3/4 mr-4 md:mr-12"
                        required={true}
                    />

                    <TextField
                        text="Weekly Commitment(in hrs)"
                        extraClass="w-full md:w-1/3 mt-1 mb-4 md:mb-0"
                        fieldExtraClass="w-full"
                        onChange={changeInput}
                        name="commitment"
                        value={projDetails.commitment}
                        required={true}
                    />
                </div>

                <div className="flex flex-row mb-2 w-full">
                    <Dropdown
                        text="Location"
                        changeDropdown={changeTags}
                        name="location"
                        val={projDetails.location}
                        placeholder="Location"
                        extraClass="mb-8 w-1/2"
                        fieldExtraClass="w-4/5"
                        options={[{ value: "WFH", label: "Work From Home" }, { value: projDetails.college || props.college, label: projDetails.college || props.college }]}
                        required={true}
                    />

                    <Dropdown
                        text="Visibility"
                        changeDropdown={changeTags}
                        name="restrictedView"
                        val={projDetails.restrictedView}
                        placeholder="Visibility"
                        extraClass="mb-8 w-1/2"
                        fieldExtraClass="w-4/5"
                        options={[{ value: true, label: "Show it only to students in my college" }, { value: false, label: "Show it to everyone" }]}
                        required={true}
                        toolTipId="Visibility"
                        toolTipMessage="Choose where you want this project to be visible."
                    />

                </div>

                {!props.editMode && <TagInput
                    text="Enter some questions you would like the student to answer in his application (this cannot be changed later)"
                    extraClass="flex justify-center mx-auto flex-col mb-6"
                    fieldExtraClass="w-full md:w-3/5"
                    updateTags={changeTags}
                    chosenTags={projDetails.questionnaire}
                    maxNumberOfTags={10}
                    noSuggestions={true}
                    name="questionnaire"
                    heading="Chosen Questionnaire"
                    allCases={true}
                    toolTipId="questionnaire"
                    toolTipMessage="We shall present this questionnaire to the student before he completes his application"
                />}

                {!props.editMode && <TagInput
                    text="Tags which will help match students (eg. machine-learning)"
                    extraClass="flex justify-center mx-auto flex-col mb-4"
                    fieldExtraClass="w-full md:w-3/5"
                    updateTags={changeTags}
                    chosenTags={projDetails.tags}
                    maxNumberOfTags={3}
                    name="tags"
                    heading="Chosen Tags"
                    required={true}
                />}

                <TealButton
                    text="Show Preview"
                    extraClass="mt-6 mx-auto"
                    submitForm={showPreview}
                />

                <Error text={errorText} extraClass="mt-8" />
            </Modal>

            :

            <Modal
                modalOpen={props.modalOpen}
                closeModal={closeModal}
                text={"Preview of " + projDetails.name}
                backButton={true}
                backButtonClick={e => setPreviewMode(false)}
            >

                <DetailsTab projDetails={projDetails} professor={true} />

                <DisplayList list={projDetails.questionnaire} text="Questionnaire" extraClass="my-2" />
                <DisplayList list={projDetails.prereq} text="Prerequisites / Skills" extraClass="my-2"/>

                <TealButton
                    text="Add project"
                    extraClass="mt-6 mx-auto"
                    ref={btnRef}
                    submitForm={submitForm}
                />
                <Error text={errorText} extraClass="mt-8" />

            </Modal>
    );

}

export default AddProject;