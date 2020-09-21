import React, { useState, useEffect } from 'react';
import AnswersAndSop from './AnswersAndSop';
import Modal from '../../../General/Modal/Modal';
import { TealButton } from '../../../General/Form/FormComponents';
import { Error, TextArea, TextField, Title } from '../../../General/Form/FormComponents';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function ApplicationDetails(props) {

    const { projectId } = useParams();
    const [answersModal, setAnswersModal] = useState(false);
    const [details, setDetails] = useState({});
    const [errorText, setError] = useState('');

    useEffect(() => {
        axios.get('/api/student/application/' + projectId.toString())
            .then(res => {
                if (res.data.answers.length !== res.data.questionnaire.length) {
                    setError("The number of questions and answers don't match")
                }
                else
                    setDetails(res.data)
            })
            .catch(err => setError(err.response.data));
    }, [])

    return (

        <div>
            
            <div className="flex justify-end mx-16 cursor-pointer">
                <p className="underline" onClick={e => setAnswersModal(true)} >Show Application</p>
            </div>       

            <Modal
                modalOpen={answersModal}
                closeModal={e => setAnswersModal(false)}
                text={<p className="px-8 text-2xl">Application for <span className="text-teal-700">project_name</span></p>}
            >
                <AnswersAndSop details={details} errorText={errorText}/>

            </Modal>


            <div className="px-8 md:px-24">
                <p className="text-2xl">Feedback</p>
                {details.feedbacks && details.feedbacks.map(feedback =>{
                    return(
                        <div key={feedback.timestamp} className="my-2 px-2">
                            <p className="text-lg">Time: {(new Date((feedback.timestamp)).toDateString())}</p>
                            <p className="text-lg">Feedback: {feedback.feedback}</p>
                            <p className="text-lg">Rating: {feedback.rating}</p>
                        </div>
                    )
                })}
                
            </div>

            <div className="px-8 md:px-24">
                <p className="text-2xl">Messages</p>
            </div>

            <Error text={errorText} divClass="flex justify-center" />

        </div>
    )

}

export default ApplicationDetails;