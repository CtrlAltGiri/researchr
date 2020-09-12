import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import '../../../Header/svg.css';
import { TextField, Title, Label, TealButton, Error, Checkbox } from '../../../General/Form/FormComponents';
import TagInput from '../../../General/TagInput/TagInput';
import MonthYear from '../../../General/Dropdown/MonthYear'

function ProjectModal(props) {

    const [checked, setChecked] = useState(props.formState.researchProject || false)

    ReactModal.setAppElement(document.getElementById('root'));
    useEffect(() => {
        let anotherChange;
        let name = "researchProject", value = checked;
        if (!checked) {
            anotherChange = {
                "professor": "-",
                "college": "-",
                "startDate": "-",
                "endDate": "-",
                [name]: value
            }
        }
        else {
            anotherChange = {
                "professor": props.formState.professor.replace('-', '') || "",
                "college": props.formState.college.replace('-', '') || "",
                "startDate": props.formState.startDate.toString().replace('-', '') || "",
                "endDate": props.formState.endDate.toString().replace('-', '') || "",
                [name]: value
            }
        }
        props.changeInput({}, anotherChange);
    }, [checked])


    return (
        <ReactModal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
        >
            <div className="flex flex-col w-full">
                <form className="flex flex-col" onSubmit={props.submitInnerForm}>

                    <div className="flex flex-row justify-between">
                        <Title text="Enter details of your projects" />
                        <button name="close" className="pr-4 focus:outline-none" onClick={(e) => { props.closeModal(e) }}><svg className="svg-icon" viewBox="0 0 20 20">
                            <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                        </svg></button>
                    </div>

                    <TextField
                        text="Title of Project"
                        onChange={props.changeInput}
                        name="title"
                        value={props.formState.title}
                        extraClass="mb-8"
                        fieldExtraClass="w-full md:w-1/2"
                    />

                    <Checkbox
                        text="Is this a research project under a guide?"
                        onChange={(e) => setChecked(!checked)}
                        name="researchProject"
                        value={props.formState.researchProject}
                        extraClass="mb-4"
                        ID="researchProject"
                    />

                    {props.formState.researchProject &&
                        <div className="flex flex-col md:flex-row md:flex-wrap mb-8">

                            <TextField
                                text="Under the guidance of"
                                onChange={props.changeInput}
                                name="professor"
                                value={props.formState.professor}
                                extraClass="w-full md:w-1/2 mb-2"
                                fieldExtraClass="w-full md:w-3/4"
                            />

                            <TextField
                                text="College"
                                onChange={props.changeInput}
                                name="college"
                                value={props.formState.college}
                                extraClass="w-full md:w-1/2 mb-2"
                                fieldExtraClass="w-full md:w-3/4"
                            />

                            <MonthYear
                                name="startDate"
                                onChange={props.changeDropdown}
                                date={props.formState.startDate}
                                extraClass="w-full md:w-1/2 mb-2"
                                innerClass="flex"
                                fieldExtraClass="w-full md:w-3/4 mr-24"
                                text="Start Date"
                            />

                            <MonthYear
                                name="endDate"
                                onChange={props.changeDropdown}
                                date={props.formState.endDate}
                                extraClass="w-full md:w-1/2 mb-2"
                                innerClass="flex"
                                fieldExtraClass="w-full md:w-3/4 mr-24"
                                text="End Date"
                            />

                        </div>
                    }
                    <div className="mb-8">
                        <Label text="Any additional information" />
                        <textarea
                            onChange={props.changeInput}
                            className="p-2 min-w-full outline-none focus:border-teal-500 border-2 rounded-lg min-h-1/4"
                            name="experience"
                            value={props.formState.experience}
                        />
                    </div>

                    <TextField
                        text="Link for Proof (Drive / Github repository)"
                        onChange={props.changeInput}
                        name="proof"
                        value={props.formState.proof}
                        extraClass="mb-8"
                        fieldExtraClass="w-full md:w-1/2"
                    />

                    <TextField
                        text="URL (for logo on profile)"
                        onChange={props.changeInput}
                        name="url"
                        value={props.formState.url}
                        extraClass="w-full md:w-1/2 mb-8"
                        fieldExtraClass="w-full md:w-3/4"
                    />

                    <TagInput
                        text="ResearchR tags"
                        extraClass="mb-8"
                        fieldExtraClass="w-full md:w-1/2"
                        name="tags"
                        updateTags={props.updateTags}
                        chosenTags={props.formState.tags}
                        maxNumberOfTags={2}
                    />

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

export default ProjectModal;