import React, {useState} from 'react';
import {Step1, Step2, Step3, Step4} from './Steps';

function CreateProfile(props) {


    // TODO (Giri): The initial states of these are to be set after the initial GET to the server
    // to see previous completion.
    const [step, setStep] = useState(2);
    const [completedStep, setCompletedStep] = useState(1);
    const [showError, setShowError] = useState(false);
    const [completeFormState, setCompleteFormState] = useState({step1: {}, step2: {}, step3: {}, step4: {}});

    function updateCompletedStep(newStep, formState){

        setCompleteFormState({...completeFormState, ["step" + newStep]: formState});
        // TODO (Giri) : Make a post request here and make sure the server checks the values before pusing.
        // Reuturn an error code and based on that show error to the user.
        setStep(newStep + 1);
        setCompletedStep(newStep);
        setShowError(false)
    }

    return (
        <section className="text-gray-700 body-font">
            {showError ? <h1 className="text-red-500 text-center text-2xl">Complete Previous Steps</h1> : ""}
            <div className="container px-5 py-12 mx-auto flex flex-wrap flex-col">
                <div className="flex mx-auto flex-wrap mb-12">
                    <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${step === 1 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                        onClick={(e) => {setStep(1)}}>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>STEP 1
                    </a>
                    <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${step === 2 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                        onClick={(e) => {if(completedStep >= 1) setStep(2); else setShowError(true)}}>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                        </svg>STEP 2
                    </a>
                    <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${step === 3 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                        onClick={(e) => {if(completedStep >= 2) setStep(3); else setShowError(true)}}>
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <circle cx={12} cy={5} r={3} />
                            <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3" />
                        </svg>STEP 3
                    </a>
                    <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${step === 4 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                        onClick={(e) => {if(completedStep >= 3) setStep(4); else setShowError(true)}}>
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx={12} cy={7} r={4} />
                        </svg>STEP 4
                    </a>
                </div>
                {step === 1 ?
                    <Step1 
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step1}
                    /> :
                    step === 2?
                    <Step2
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step2}
                    />:
                    <h1>Giridhar, lol bye</h1>
                }
                
            </div>
        </section>
    )
}

export default CreateProfile;