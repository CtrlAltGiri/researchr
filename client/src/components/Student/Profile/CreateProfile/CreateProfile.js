import React, { useState, useEffect } from 'react';
import { Step1, Step2, Step3, Step4, CompleteStep } from './Steps';
import StepsHeader from './Utils/StepsHeader';
import { Error } from '../../../General/Form/FormComponents';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


function CreateProfile(props) {

    // TODO (Giri): The initial states of these are to be set after the initial GET to the server
    // to see previous completion.
    const [step, setStep] = useState(1);
    const [completedStep, setCompletedStep] = useState(0);
    const [errorText, setShowError] = useState("");
    const [redirect, setRedirect] = useState(null);
    const [completeFormState, setCompleteFormState] = useState({ step1: {}, step2: {}, step3: {}, step4: {} });

    function updateState(newStep, formState) {
        setCompleteFormState({ ...completeFormState, ["step" + newStep]: formState });
        setStep(newStep + 1);
        setCompletedStep(newStep);
        setShowError("");
    }

    function updateCompletedStep(newStep, formState) {
        axios.post('/api/student/profile/createProfile', {
            step: newStep,
            value: formState,
        })
            .then(function (response) {
                updateState(newStep, formState)
            })
            .catch(function (error) {
                setShowError(error.response.data);
            });
    }

    useEffect(() => {
        axios.get('/api/student/profile/myProfile', { params: { cvElements: true } })
            .then(function (response) {
                let profile = response.data.cvElements;
                profile && setCompleteFormState({
                    step1: {
                        truth: profile.truth || false,
                        TandC: profile.TandC || false
                    },
                    step2: {
                        school: (profile.education && profile.education.school) || {},
                        college: (profile.education && profile.education.college) || []
                    },
                    step3: {
                        workExperiences: profile.workExperiences || [],
                        projects: profile.projects || []
                    },
                    step4: {
                        interestTags: profile.interestTags || []
                    }
                })
            })
            .catch(function (err) {
                console.log(err);
                setRedirect('/error');
            })
    }, []);


    if (redirect) {
        return <Redirect to={redirect} />
    }

    return (
        <section className="text-gray-700 body-font">
            <div className="container px-5 py-12 mx-auto flex flex-wrap flex-col">

                <StepsHeader
                    step={step}
                    completedStep={completedStep}
                    setStep={setStep}
                    setShowError={setShowError}
                />
                {
                    step === 1 ?
                        <Step1
                            updateCompletedStep={updateCompletedStep}
                            formData={completeFormState.step1}
                        /> :
                        step === 2 ?
                            <Step2
                                updateCompletedStep={updateCompletedStep}
                                formData={completeFormState.step2}
                            /> :
                            step === 3 ?
                                <Step3
                                    updateCompletedStep={updateCompletedStep}
                                    formData={completeFormState.step3}
                                /> :
                                step === 4 ?
                                    <Step4
                                        updateCompletedStep={updateCompletedStep}
                                        formData={completeFormState.step4}
                                    /> :
                                    <CompleteStep />
                }
                <Error text={errorText} extraClass="text-center" />
            </div>
        </section>
    );
}

export default CreateProfile;