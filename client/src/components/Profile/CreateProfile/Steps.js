import React, { useState } from 'react';
import CollegeModal from './CollegeModal';
import Accordian from '../../General/Accordian/Accordian';
import Dropdown from "../../General/Dropdown/Dropdown";
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

    const [completeFormState, setCompleteFormState] = useState([])
    const [formState, setFormState] = useState({});
    const [showError, setshowError] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [schoolState, setSchoolState] = useState({
        scoring10: "Percentage",
        scoring12: "Percentage",
        grade10: "",
        grade12: ""
    })

    function submitInnerForm(event) {
        event.preventDefault();
        if (formState.hasOwnProperty('college') && formState.hasOwnProperty('branch') && formState.hasOwnProperty('degree') && formState.hasOwnProperty('yog') && formState.hasOwnProperty('experience')) {
            setCompleteFormState([...completeFormState, formState]);
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

    function changeDropdown(event, newItem){
        setSchoolState({...schoolState, [event.target.name]: newItem});
    }

    function changeSchoolInput(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setSchoolState({...schoolState, [name]: value});
    }

    function submitOuterForm(event){
        //TODO (giri): Check if entered values are numeric
        if(schoolState.grade10 !== "" && schoolState.grade12 !== ""){
            let finalObj = {
                school: schoolState,
                college: completeFormState
            }
            props.updateCompletedStep(2, finalObj);
        }
        else{
            console.log("Show outer error");
        }
    }

    return (

        <div className="mb-8">

            <p className="mb-8 text-xl text-gray-900 font-medium title-font">School</p>
            <div className="flex flex-row flex-wrap mb-16 justify-around">

                <div>
                    <p className="text-l text-gray-700 px-1 mb-1 font-medium">10th Score</p>
                    <input type="text" onChange={changeSchoolInput} className="outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2" name="grade10"></input>
                </div>
                <div className="mb-16 md:mb-0">
                    <p className="text-l text-gray-700 mb-1 font-medium">Scoring</p>
                    <Dropdown
                        name={schoolState.scoring10}
                        uniqueName={"scoring10"}
                        menuItems={["CGPA", "Percentage"]}
                        setDropdown={changeDropdown}
                    />
                </div>
                <div>
                    <p className="text-l text-gray-700 px-1 mb-1 font-medium">12th Score</p>
                    <input type="text" onChange={changeSchoolInput} className="outline-none focus:border-teal-500 border-2 rounded-lg py-1 px-2" name="grade12"></input>
                </div>
                <div>
                    <p className="text-l text-gray-700 mb-1 font-medium">Scoring</p>
                    <Dropdown
                        name={schoolState.scoring12}
                        uniqueName={"scoring12"}
                        menuItems={["CGPA", "Percentage"]}
                        setDropdown={changeDropdown}
                    />
                </div>
            </div>



            <p className="mb-4 text-xl text-gray-900 font-medium title-font">University</p>


            {completeFormState.length > 0 ? (<div className="w-full md:w-3/5 my-4 shadow-md">{completeFormState.map((college, index) => {
                return <Accordian
                    key={index}
                    uniqueNumber={"Accoridan" + index}
                    heading={college.college}
                    description={college.experience}
                />
            })
            }
            </div>)
                : ""}


            <button className="flex" onClick={(e) => setModalOpen(true)}>
                <svg class="svg-icon" viewBox="0 0 20 20">
                    <path fill="none" d="M13.388,9.624h-3.011v-3.01c0-0.208-0.168-0.377-0.376-0.377S9.624,6.405,9.624,6.613v3.01H6.613c-0.208,0-0.376,0.168-0.376,0.376s0.168,0.376,0.376,0.376h3.011v3.01c0,0.208,0.168,0.378,0.376,0.378s0.376-0.17,0.376-0.378v-3.01h3.011c0.207,0,0.377-0.168,0.377-0.376S13.595,9.624,13.388,9.624z M10,1.344c-4.781,0-8.656,3.875-8.656,8.656c0,4.781,3.875,8.656,8.656,8.656c4.781,0,8.656-3.875,8.656-8.656C18.656,5.219,14.781,1.344,10,1.344z M10,17.903c-4.365,0-7.904-3.538-7.904-7.903S5.635,2.096,10,2.096S17.903,5.635,17.903,10S14.365,17.903,10,17.903z"></path>
                </svg>
            </button>


            {completeFormState.length > 0 && <button className="flex mx-auto text-white mt-6 bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg" onClick={submitOuterForm}>Next</button>}


            <CollegeModal
                submitInnerForm={submitInnerForm}
                changeInput={changeInput}
                showError={showError}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
            />


        </div>
    )
}

function Step3(props) {

}

function Step4(props) {

}

export { Step1, Step2, Step3, Step4 };