import React, { useState } from 'react';
import AddExperience from './Utils/AddExperience';
import School from './Utils/School';
import CollegeModal from './Utils/CollegeModal';
import WorkModal from './Utils/WorkModal';
import ProjectModal from './Utils/ProjectModal';
import { TealButton, Error } from '../../General/Form/FormComponents';
import TagInput from '../../General/TagInput/TagInput';
import '../../Header/svg.css'
import {Link} from 'react-router-dom';
import CompleteGif from '../../../assets/images/profilePage/complete.gif'

function Step1(props) {

    const [formState, setFormState] = useState({
        truth: props.formData.truth || false,
        TandA: props.formData.TandA || false
    });

    const [showError, setshowError] = useState(false);

    function submitForm(event) {
        event.preventDefault();
        if (formState.TandA === false || formState.truth === false) {
            setshowError(true);
        }
        else {
            // post data here for step1.
            props.updateCompletedStep(1, formState);
        }
    }

    function changeInput(event) {
        setFormState({ ...formState, [event.target.name]: event.target.value })
    }

    return (
        <div>
            {
                // image that we might want to use. <img className="xl:w-1/4 lg:w-1/3 md:w-1/2 w-2/3 block mx-auto mb-10 object-cover object-center rounded" alt="hero" src="https://dummyimage.com/720x600" />
            }
            <div className="flex flex-col text-center w-full">
                <h1 className="text-xl font-medium title-font mb-4 text-gray-900">Complete your re.searchR profile!</h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base">The first step to building your research profile and sharing this in the midst of chaos among the world.<br /> <br /></p>

                <form className="flex flex-col" onSubmit={submitForm}>
                    <div>
                        <input onChange={changeInput} id="truth" type="checkbox" name="truth" className="p-2 mx-2 border-b-2 outline-none" defaultChecked={formState.truth}></input>
                        <label htmlFor="truth">I will be truthful about everything and can be eliminated from <br className="hidden md:block" />the platform in case of discrepencies</label>
                    </div>
                    <div>
                        <input onChange={changeInput} id="TandA" type="checkbox" name="TandA" className="p-2 mt-8 mx-2 border-b-2 outline-none" defaultChecked={formState.TandA}></input>
                        <label htmlFor="TandA">I agree to the terms and conditions.</label>
                    </div>

                    <button type="submit" className="flex mx-auto text-white mt-6 bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">Next</button>
                    {showError && <h1 className="text-red-500 text-2xl mt-4">Please agree to all above conditions</h1>}
                </form>

            </div>
        </div>
    )
}

function Step2(props) {

    const [collegeState, setCollegeState] = useState(props.formData.college || [])
    const [schoolState, setSchoolState] = useState(props.formData.school || {
        scoring10: "Percentage",
        scoring12: "Percentage",
        grade10: "",
        grade12: ""
    });
    const [outerErrorShow, setOuterErrorShow] = useState(false);

    function submitOuterForm(event) {
        //TODO (giri): Check if entered values are numeric
        if (schoolState.grade10 !== "" && schoolState.grade12 !== "" && collegeState.length > 0) {
            let finalObj = {
                school: schoolState,
                college: collegeState
            }
            setOuterErrorShow(false);
            props.updateCompletedStep(2, finalObj);
        }
        else {
            setOuterErrorShow(true);
        }
    }

    return (
        <div className="mb-8">
            <School
                school={schoolState}
                setSchoolState={setSchoolState}
            />

            <AddExperience
                mainObject={collegeState}
                setMainObject={setCollegeState}
                requiredFields={['college', 'branch', 'degree', 'yog', 'cgpa']}
                shownFields={['degree', 'branch', 'cgpa', 'yog', 'experience']}
                shownFieldsDesc={["Degree", "Branch", "CGPA", "Year of Graduation", "Experience"]}
                heading="college"
                title="University"
                modal={CollegeModal}
            />

            {collegeState.length > 0 && <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Next"} />}
            {outerErrorShow && <Error text="Please ensure all fields are filled" />}
        </div>
    )
}

function Step3(props) {

    const [workExperiences, setWorkExperiences] = useState(props.formData.workExperiences || []);
    const [projects, setProjects] = useState(props.formData.projects || []);

    function submitOuterForm(event) {
        //TODO (giri): Check the values entered before making the call.
        let finalObj = {
            workExperiences: workExperiences,
            projects: projects
        }
        props.updateCompletedStep(3, finalObj);
    }

    return (
        <div className="mb-8">
            <AddExperience
                mainObject={workExperiences}
                setMainObject={setWorkExperiences}
                requiredFields={['company', 'position', 'startDate', 'endDate', 'proof', 'tags']}
                shownFields={['position', 'startDate', 'endDate', 'experience', 'tags']}
                shownFieldsDesc={["Position", "Start Date", "End Date", 'Experience', 'ResearchR Tags']}
                heading="company"
                title="Work Experience"
                extraClass="mb-8"
                modal={WorkModal}
            />

            <AddExperience
                mainObject={projects}
                setMainObject={setProjects}
                requiredFields={['title', 'proof', 'tags', 'professor', 'designation', 'college', 'duration']}
                shownFields={['experience', 'tags', 'professor', 'designation', 'college', 'duration']}
                shownFieldsDesc={["Experience", "Tags", "Professor", "Designation of Professor", "College Associated", "Duration"]}
                heading="title"
                title="Projects"
                modal={ProjectModal}
            />

            <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Next"} />
        </div>
    )
}

function Step4(props) {

    const [tags, setTags] = useState(props.tags)

    function submitOuterForm(event) {
        let finalObj = {
            tags: tags,
        }
        props.updateCompletedStep(4, finalObj);
    }

    return (
        <div>
            <TagInput
                extraClass="w-1/2 mx-auto"
                text="Interest tags"
                onChange={(e) => setTags(e.target.value)}
                fieldExtraClass="w-full"
                name="tagInput"
                value={tags}
            />

            <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Complete"} />
        </div>
    )

}

function CompleteStep(){

    return (
        <div className="flex flex-col text-center w-full">
                <img src={CompleteGif} className="mx-auto" height="120px" width="120px"/>
                <h1 className="text-xl font-medium title-font mb-4 text-gray-900">You have completed your researchR profile!</h1>
                <p className="lg:w-2/3 mx-auto leading-relaxed text-base">You can now apply for all projects.</p>
                <Link to="/platform" className="text-teal-700 mt-12">Go back to platform</Link>
        </div>
    )
}

export { Step1, Step2, Step3, Step4, CompleteStep };