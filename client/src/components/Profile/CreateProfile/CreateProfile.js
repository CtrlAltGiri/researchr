import React, {useState, useEffect} from 'react';
import {Step1, Step2, Step3, Step4, CompleteStep} from './Steps';
import StepsHeader from './Utils/StepsHeader';
import axios from 'axios';

function CreateProfile(props) {

    // TODO (Giri): The initial states of these are to be set after the initial GET to the server
    // to see previous completion.
    const [step, setStep] = useState(1);
    const [completedStep, setCompletedStep] = useState(0);
    const [showError, setShowError] = useState("");
    const [completeFormState, setCompleteFormState] = useState({step1: {}, step2: {}, step3: {}, step4: []});

    function updateState(newStep, formState){
        setCompleteFormState({...completeFormState, ["step" + newStep]: formState});
        setStep(newStep + 1);
        setCompletedStep(newStep);
        setShowError("");
    }

    function updateCompletedStep(newStep, formState){
        axios.post('/api/profile/createProfile', {
            step: newStep,
            value: formState,
        }).then(function(response){
            updateState(newStep, formState)
        }).catch(function(error){
            setShowError(error);
        });
    }

    useEffect(()=>{
        axios.get('/api/profile/myProfile')
        .then(function(response){
            response.data && 
            setCompleteFormState({
                step1:{
                    truth: response.data.TandC || false,
                    TandC: response.data.TandC || false
                },
                step2:{
                    school: response.data.education.school || {},
                    college: response.data.education.college || []
                },
                step3:{
                    workExperiences : response.data.workExperiences || [],
                    projects: response.data.projects || []
                },
                step4:{
                    interestTags: response.data.interestTags || []
                }
            })
        })
    }, []);

    return (
        <section className="text-gray-700 body-font">
            {showError.length > 0 ? <h1 className="text-red-500 text-center text-2xl">{showError}</h1> : ""}
            <div className="container px-5 py-12 mx-auto flex flex-wrap flex-col">
                
                <StepsHeader 
                    step = {step}
                    completedStep ={completedStep}
                    setStep = {setStep}
                    setShowError = {setShowError}
                />
                {
                    step === 1 ?
                    <Step1 
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step1}
                    />:
                    step === 2?
                    <Step2
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step2}
                    />:
                    step === 3?
                    <Step3 
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step3}
                    />:
                    step === 4?
                    <Step4
                        updateCompletedStep={updateCompletedStep}
                        formData={completeFormState.step4}
                    />:
                    <CompleteStep />
                }

            </div>
        </section>
    );
}

export default CreateProfile;