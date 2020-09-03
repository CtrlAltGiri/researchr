import React, { useState } from 'react';
import School from './Utils/Step2/School'
import College from './Utils/Step2/College';
import {TealButton, Error} from '../../General/Form/FormComponents';
import '../../Header/svg.css'

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
            <College
                college={collegeState}
                setCollegeState={setCollegeState}
            />
            {collegeState.length > 0 && <TealButton extraClass="flex mx-auto mt-6" submitForm={submitOuterForm} text={"Next"}/>}
            {outerErrorShow && <Error text="Please ensure all fields are filled" />}
        </div>
    )
}

function Step3(props) {
}

function Step4(props) {

}

export { Step1, Step2, Step3, Step4 };