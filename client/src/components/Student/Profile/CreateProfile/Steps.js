import React, { useState } from 'react';
import AddExperience from './Utils/AddExperience';
import School from './Utils/School';
import CollegeModal from './Utils/CollegeModal';
import WorkModal from './Utils/WorkModal';
import ProjectModal from './Utils/ProjectModal';
import { TealButton, Error } from '../../../General/Form/FormComponents';
import {schoolFormValidator, collegeFormValidator, workFormValidator, projectFormValidator} from '../../../../common/formValidators/cvValidator'
import TagInput from '../../../General/TagInput/TagInput';
import {Link} from 'react-router-dom';
import CompleteGif from '../../../../assets/images/profilePage/complete.gif'


function Step1(props) {

    const [formState, setFormState] = useState({
        truth: props.formData.truth || false,
        TandC: props.formData.TandC || false
    });

    const [showError, setshowError] = useState(false);

    function submitForm(event) {
        event.preventDefault();
        if (formState.TandC === false || formState.truth === false) {
            setshowError(true);
        }
        else {
            props.updateCompletedStep(1, formState);
        }
    }

    function changeInput(event) {
        setFormState({ ...formState, [event.target.name]: event.target.checked })
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
                        <input onChange={changeInput} id="TandC" type="checkbox" name="TandC" className="p-2 mt-8 mx-2 border-b-2 outline-none" defaultChecked={formState.TandC}></input>
                        <label htmlFor="TandC">I agree to the terms and conditions.</label>
                    </div>

                    <button type="submit" className="flex mx-auto text-white mt-6 bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">Next</button>
                    {showError && <Error text="Please agree to all above conditions" />}
                </form>

            </div>
        </div>
    )
}

function Step2(props) {

    const [collegeState, setCollegeState] = useState(props.formData.college || []);
    const [schoolState, setSchoolState] = useState(props.formData.school || {
        scoring10: "Percentage",
        scoring12: "Percentage",
        grade10: "",
        grade12: ""
    });
    const [showError, setOuterErrorShow] = useState('');

    function submitOuterForm(event) {
        
        let retVal = schoolFormValidator(schoolState);
        if (retVal === true && collegeState.length > 0) {
            let finalObj = {
                school: schoolState,
                college: collegeState
            }
            setOuterErrorShow('');
            props.updateCompletedStep(2, finalObj);
        }
        else {
            setOuterErrorShow(retVal);
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
                heading="college"   // this cannot change, needed for updateTags in AddExperience.js
                title="University"
                modal={CollegeModal}
                formValidator={collegeFormValidator}
                defaultValues={props.formData.defaultCollege}
            />

            {collegeState.length > 0 && <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Next"} />}
            <div className="my-4">
                <Error text={showError} />
            </div>
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
                requiredFields={['organization', 'position', 'startDate', 'endDate', 'proof', 'tags']}
                shownFields={['position', 'startDate', 'endDate', 'experience', 'tags']}
                shownFieldsDesc={["Position", "Start Date", "End Date", 'Experience', 'ResearchR Tags']}
                heading="organization"
                title="Work Experience"
                extraClass="mb-8"
                modal={WorkModal}
                formValidator={workFormValidator}
            />

            <AddExperience
                mainObject={projects}
                setMainObject={setProjects}
                requiredFields={['title', 'proof', 'tags', 'professor', 'college', 'startDate', 'endDate']}
                shownFields={['experience', 'tags', 'professor', 'college', 'startDate', 'endDate']}
                shownFieldsDesc={["Experience", "Tags", "Professor", "College Associated", "Start Date", "End Date  "]}
                heading="title"
                title="Projects"
                modal={ProjectModal}
                formValidator={projectFormValidator}
            />

            <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Next"} />
       </div>
    )
}

function Step4(props) {

    const [interestTags, setTags] = useState(props.formData.interestTags || [])

    function submitOuterForm(event) {
        let finalObj = {
            interestTags: interestTags
        }
        props.updateCompletedStep(4, finalObj);
    }

    return (
        <div>
            <TagInput
                text="Enter Interest tags"
                extraClass="flex justify-center px-16 mx-auto flex-col"
                updateTags={setTags}
                chosenTags={interestTags}
                maxNumberOfTags={3}
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
                <Link to="/student" className="text-teal-600 mt-12">Go back to platform</Link>
        </div>
    )
}

export { Step1, Step2, Step3, Step4, CompleteStep };