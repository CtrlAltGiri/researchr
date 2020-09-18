import React, { useState, useEffect } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import Skill from './Skill';
import ReactModal from 'react-modal';
import { CloseButton, TextArea, Title, TealButton, Error, BackButton } from '../../../General/Form/FormComponents'
import axios from 'axios';
import { answersFormCheck, sopFormCheck } from '../../../../common/formValidators/sopValidator';

const slideValues = {
    DESCRIPTION: "desc",
    SKILLS: "skills",
    DETAILS: "details"
}

function ProjectPage(props) {

    let { projectId } = useParams();
    const [slider, setSlider] = useState(slideValues.DESCRIPTION);
    const [modalOpen, setModalOpen] = useState(false);
    const [questionnaire, setQuestionnaire] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [step, setStep] = useState(1);
    const [errorText, setError] = useState('');
    const [sop, setSop] = useState();
    const [apply, setApply] = useState(false);
    const [projDetails, setProjDetails] = useState({});
    const [redirect, setRedirect] = useState(false);
    const [applyError, setApplyError] = useState('')

    useEffect(() => {
        
        axios.get(props.url ? props.url : ("/api/student/project/" + projectId.toString()))
            .then(res => {
                setProjDetails(res.data);
                setApply(res.data.apply);
                setQuestionnaire(res.data.questionnaire);
                
                // set empty answers for all initially
                let len = res.data.questionnaire.length;
                let ans = []
                for(let i = 0; i < len; i++){
                    ans.push('');
                }
                setAnswers(ans);

                if(res.data.apply === false){
                    setApplyError(res.data.errorMsg)
                }
                if(props.professor){
                    props.retProjDetails(res.data);
                }
            })
            .catch(err => {
                setError(err.response.data);
            });
    }, [])

    function answerQuestionarire(event, index) {
        let temp = [...answers];
        temp[index] = event.target.value;
        setAnswers(temp);
    }

    function submitQuestionnaire(event) {
        event.preventDefault();
        let retVal = answersFormCheck(answers)
        if (retVal === true) {
            setError('')
            setStep(2);
        }
        else {
            setError("Limit answer to 150 words in #" + retVal);
        }
    }

    function submitApplication(event) {
        event.preventDefault();

        let retVal = sopFormCheck(sop)
        if (sopFormCheck(sop) !== true) {
            setError(retVal);
        }
        else {
            axios.post('/api/student/project/' + projectId.toString(), {
                answers: answers,
                sop: sop
            })
                .then(res => {
                    setModalOpen(false);
                    setRedirect(true);
                    
                })
                .catch(err => {
                    setError("Error in submission of project application. Please store it locally.")
                })
        }
    }

    function closeModal(event) {
        setModalOpen(false);
        setStep(1);
        setError('');
    }

    return (
        <section className="text-gray-700 body-font overflow-hidden">
            {redirect && <Redirect to="/student/applications" />}
            <div className="container px-5 py-12 mx-auto">
                {errorText.length === 0 && 
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <div className="w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest uppercase">{projDetails.professorName}</h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">{projDetails.name}</h1>
                        
                        <div className="flex mb-2 justify-around items-center pr-8">
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.DESCRIPTION ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.DESCRIPTION) }} href="#">Description</a>
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.SKILLS ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.SKILLS) }} href="#">Skills</a>
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.DETAILS ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.DETAILS) }} href="#">Details</a>
                        </div>

                        <hr className="mb-8"></hr>

                        {slider === slideValues.DESCRIPTION ?
                            <div>
                                <p className="leading-relaxed mb-8">{projDetails.desc}</p>
                            </div>
                            : slider === slideValues.SKILLS ?
                                <div className="flex flex-wrap w-full sm:mx-auto sm:mb-2 -mx-2">
                                    {projDetails.prereq && projDetails.prereq.map( (skill,index) => <Skill key={"skill" + index} skill={skill} />)}
                                </div>
                            :
                            <div className="mt-8">
                                {projDetails.startDate && <div className="flex py-2">
                                    <span className="text-gray-500">Start Date</span>
                                    <span className="ml-auto text-gray-900">{(new Date(projDetails.startDate)).toDateString()}</span>
                                </div>}
                                <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="ml-auto text-gray-900">{projDetails.duration} months</span>
                                </div>
                                <div className="flex border-t border-b border-gray-300 py-2">
                                    <span className="text-gray-500">Location</span>
                                    <span className="ml-auto text-gray-900">{projDetails.location}</span>
                                </div>  
                                <div className="flex py-2">
                                    <span className="text-gray-500">Professor's Name</span>
                                    <span className="ml-auto text-gray-900">{projDetails.professorName}</span>
                                </div>
                                <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Associated College</span>
                                    <span className="ml-auto text-gray-900">{projDetails.college}</span>
                                </div>
                                <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Designation of Professor</span>
                                    <span className="ml-auto text-gray-900">{projDetails.professorDesignation}</span>
                                </div>
                                {projDetails.applicationCloseDate && <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Close date for application</span>
                                    <span className="ml-auto text-gray-900">{(new Date(projDetails.applicationCloseDate)).toDateString()}</span>
                                </div>}
                                {projDetails.commitment && <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Commitment per week</span>
                                    <span className="ml-auto text-gray-900">{projDetails.commitment + " hours/week"}</span>
                                </div>}
                                {projDetails.tags && <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Tags</span>
                                    <span className="ml-auto text-gray-900">{projDetails.tags.join(",")}</span>
                                </div>}
                                
                            </div>
                        }

                        {props.professor ? <TealButton text="Edit" extraClass="mt-8 ml-auto flex" submitForm={(e) => props.editAction()}/> :
                        apply ? <button onClick={(e) => setModalOpen(true)} className="flex ml-auto mt-4 text-white bg-teal-500 border-0 py-2 px-6 focus:outline-none hover:bg-teal-600 rounded">Apply</button> : "" }
                    </div>
                </div>
                }
                <div className="text-center">
                    <Error text={errorText} />
                    <Error text={applyError} />
                </div>
            </div>

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={closeModal}
            >

                {step === 1 ?
                    <div>
                        <div className="flex flex-row justify-between">
                            <Title text="Questionnaire set by the professor" />
                            <CloseButton
                                onClick={closeModal}
                            />
                        </div>

                        <form className="flex flex-col" onSubmit={submitQuestionnaire}>
                            {questionnaire && questionnaire.map((question, index) => {
                                return (
                                    <TextArea
                                        text={question}
                                        extraClass="mb-8 w-full"
                                        fieldExtraClass="w-full"
                                        onChange={(e) => answerQuestionarire(e, index)}
                                        value={answers[index]}
                                        key={question + index.toString()}
                                    />
                                );
                            })}

                            <TealButton
                                text="Submit Questionnaire"
                                extraClass="mx-auto mt-4"
                                type="submit"
                            />

                        </form>
                        <Error text={errorText} />
                    </div>
                    :
                    <div>

                        <div className="flex flex-row justify-between">
                            <BackButton extraClass="mb-8" onClick={(e) => setStep(1)}/>
                            <CloseButton
                                onClick={closeModal}
                            />
                        </div>

                        <Title text="SOP to professor" />

                        <form onSubmit={submitApplication}>
                            <TextArea
                                name="SOP"
                                value={sop}
                                extraClass="mb-8"
                                text="Statement of Purpose"
                                onChange={(e) => setSop(e.target.value)}
                                rows={10}
                            />
                            <TealButton
                                text="Submit Application"
                                extraClass="mx-auto mt-4"
                                type="submit"
                            />

                        </form>

                        <Error text={errorText} />
                    </div>
                }

            </ReactModal>

        </section>
    )

}

export default ProjectPage;