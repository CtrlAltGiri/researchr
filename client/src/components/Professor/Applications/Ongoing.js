import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { Label, RedButton, TealButton, TextArea, TextField, Error } from '../../General/Form/FormComponents';
import SmallModal from '../../General/Modal/SmallModal';
import Modal from '../../General/Modal/Modal';
import Messages from '../../General/Messaging/Messages';
import BeautyStars from 'beauty-stars';
import axios from 'axios';


function FeedbackModal(props) {

    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(1);
    const [modalError, setModalError] = useState('')
    const history = useHistory();

    function submitFeedback() {

        if (feedback.length > 20) {
            axios.post('/api/professor/feedback/' + props.projectID, {
                studentID: props.studentID,
                feedback: feedback,
                rating: rating
            })
                .then(res => history.go(0))
                .catch(err => props.setErrorText(err.response.data));

            props.onRequestClose();
        }
        else {
            setModalError('Please enter a comprehensive feedback.')
        }
    }

    return (
        <SmallModal isOpen={props.isOpen} onRequestClose={props.onRequestClose}>

            <p className="px-1 mx-8 mb-8">Feedback is essential for accountability and ensures both parties are on the same page.</p>

            <TextArea
                extraClass="mb-4"
                fieldExtraClass="w-full"
                text="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                name="feedback"
            />

            <div className="px-1 mb-4">
                <div className="mb-2">
                    <Label text="Rating (out of 5)" />
                </div>
                <BeautyStars
                    value={rating}
                    onChange={val => setRating(val)}
                    inactiveColor="#e2e8f0"
                    activeColor="#319795"
                />
            </div>

            <TealButton
                divClass="flex flex-row justify-end mb-4"
                text="Submit Feedback"
                submitForm={submitFeedback}
            />

            <Error text={modalError} />

        </SmallModal>
    )
}

function MessageModal(props) {

    return (
        <Modal modalOpen={props.isOpen} closeModal={props.onRequestClose} text={"Messages with " + props.name}>
            <Messages
                studentID={props.studentID}
                projectID={props.projectID}
                professor={true}
            />
        </Modal>
    );
}

function CompletedModal(props) {

    const history = useHistory();
    function submitComplete(event) {
        axios.post('/api/professor/application/' + props.projectID, {
            studentID: props.studentID,
            newStatus: "completed"
        })
            .then(res => history.go(0))
            .catch(err => props.setErrorText(err.response.data));

        props.onRequestClose();
    }

    return (
        <SmallModal isOpen={props.isOpen} onRequestClose={props.onRequestClose}>

            <p className="mb-4 font-medium">
                Please press YES only if the student has <span className="text-teal-600 font-medium">completed the project</span> <br /> and is eligible for a researchR certificate.
            </p>
            <div className="flex flex-row justify-around">
                <TealButton
                    text="Yes"
                    submitForm={submitComplete}
                />

                <RedButton
                    text="No"
                    submitForm={props.onRequestClose}
                />
            </div>

        </SmallModal>

    )

}


function OngoingBlock(props) {

    const [openFeedback, setOpenFeedback] = useState(false);
    const [openMessages, setOpenMessages] = useState(false);
    const [openCompleted, setOpenCompleted] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:justify-between px-6 md:px-48 py-12 items-center md:items-end">

            <div className="text-center md:text-left">
                <p className="text-3xl font-medium">{props.student.name}</p>
                <p className="font-thin text-xl mb-1">{props.student.college}</p>
                <Link to={"/student/profile/" + props.student.studentID} className="font-thin text-md" target="_blank">View Profile</Link>
            </div>

            <div className="mt-8 space-y-1 text-center md:text-left">
                {props.student.status === 'ongoing' && <p className="font-thin cursor-pointer" onClick={(e) => setOpenFeedback(true)}>Give feedback</p>}
                <p className="font-thin cursor-pointer" onClick={(e) => setOpenMessages(true)}>Messages</p>
                {props.student.status === 'ongoing' ?
                    <p className="font-thin cursor-pointer" onClick={(e) => setOpenCompleted(true)}>Mark as completed</p> :
                    <p className="text-red-500">Completed</p>
                }
            </div>

            <FeedbackModal
                isOpen={openFeedback}
                onRequestClose={(e) => setOpenFeedback(false)}
                projectID={props.projectID}
                studentID={props.student.studentID}
                setErrorText={props.setErrorText}
            />

            <MessageModal
                isOpen={openMessages}
                onRequestClose={(e) => setOpenMessages(false)}
                projectID={props.projectID}
                studentID={props.student.studentID}
                name={props.student.name}
                setErrorText={props.setErrorText}
            />

            <CompletedModal
                isOpen={openCompleted}
                onRequestClose={(e) => setOpenCompleted(false)}
                projectID={props.projectID}
                studentID={props.student.studentID}
                setErrorText={props.setErrorText}
            />

        </div>
    );
}



function Ongoing(props) {
    return (

        <div>
            {props.data && props.data.map(stud => {
                return (
                    <div>
                        <OngoingBlock student={stud} projectID={props.projectID} setErrorText={props.setErrorText} />
                        <hr className="text-gray-500 mx-24 border-gray-500" />
                    </div>
                );
            })}


        </div>
    )
}

export default Ongoing;