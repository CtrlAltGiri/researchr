import React, { useState, useEffect } from 'react';
import AnswersAndSop from './AnswersAndSop';
import Modal from '../../../General/Modal/Modal';
import { Error } from '../../../General/Form/FormComponents';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Messages from '../../../General/Messaging/Messages';

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

            <div className="flex justify-center md:justify-end mx-16 cursor-pointer">
                <p className="underline" onClick={e => setAnswersModal(true)} >Show Application</p>
            </div>

            <Modal
                modalOpen={answersModal}
                closeModal={e => setAnswersModal(false)}
                text={<p className="px-8 text-2xl">Application for <span className="text-teal-700">project_name</span></p>}
            >
                <AnswersAndSop details={details} errorText={errorText} />

            </Modal>


            {details.feedbacks && details.feedbacks.length > 0 && <div className="px-8 md:px-24 mb-12">
                <p className="text-2xl">Feedback</p>
                {
                    details.feedbacks.map(feedback => {
                        return (
                            <div key={feedback.timestamp} className="my-2 px-2">
                                <p className="text-lg">Time: {(new Date((feedback.timestamp)).toDateString())}</p>
                                <p className="text-lg">Feedback: {feedback.feedback}</p>
                                <p className="text-lg">Rating: {feedback.rating}</p>
                            </div>
                        )
                    })
                }

            </div>
            }

            <div className="px-8 md:px-24 max-h-screen mb-24">
                <p className="text-2xl my-2">Messages</p>
                {details.messages && details.messages.length > 0 ? 
                    <Messages
                        studentID={undefined}
                        projectID={projectId}
                        professor={false}
                        messages={details.messages}
                    />
                :
                    <p>The professor has to send you a message first before you can send him one!</p>
                }
            </div>

            <Error text={errorText} divClass="flex justify-center" />

        </div>
    )

}

export default ApplicationDetails;