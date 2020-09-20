import axios from 'axios';
import React, { useState } from 'react';
import { AcceptButton, DeclineButton, SettingsButton } from '../../General/Form/Buttons';
import { RedButton, TealButton, TextArea } from '../../General/Form/FormComponents';
import SmallModal from '../../General/Modal/SmallModal';
import { useHistory } from 'react-router-dom';


function changeStatus(studentID, newStatus, message, projectID) {

    let finalObj = {
        studentID: studentID,
        newStatus: newStatus,
    }

    if (message && message.length > 0) {
        finalObj.message = message;
    }

    axios.post('/api/professor/application/' + projectID, finalObj)
        .then(res => {
            return true;
        })
        .catch(err => {
            return err.response.data;
        });
}

function ActiveModal(props) {

    const [message, setMessage] = useState('');
    const history = useHistory();

    function acceptStudent(event) {
        const retVal = changeStatus(props.studentID, props.newStatus, message, props.projectID);
        props.closeModal(false);
        if (retVal !== true) {
            props.setErrorText(retVal);
        }
        else {
            history.go(0);
        }
    }

    return (
        <SmallModal
            isOpen={props.modalOpen}
            onRequestClose={(e) => props.closeModal(false)}
        >

            {props.text}

            {
                props.textArea &&
                <TextArea
                    text="Enter a message to the student so he can contact you."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    name="message"
                    extraClass="my-4"
                />
            }

            <div className="flex justify-around mt-4">
                <TealButton
                    text="Yes"
                    submitForm={acceptStudent}
                />

                <RedButton
                    text="No"
                    submitForm={(e) => props.closeModal(false)}
                />
            </div>

        </SmallModal>
    )
}


function AcceptInterviewReject(props) {

    const [active, setActive] = useState(false);
    const [interview, setInterview] = useState(false);
    const [reject, setReject] = useState(false);

    return (
        <div className="flex justify-around">

            {
                props.accept && <AcceptButton
                    onClick={(e) => setActive(true)}
                />
            }

            {
                props.accept && <ActiveModal
                    modalOpen={active}
                    closeModal={setActive}
                    setErrorText={props.setErrorText}
                    newStatus="selected"
                    projectID={props.projectID}
                    studentID={props.studentID}
                    text={<p className="px-1 font-semibold">You are about to accept a student into this project.<br />
                        Please ensure you are sure of this decision before continuing.</p>}
                    textArea={true}
                />
            }

            {
                props.interview && <SettingsButton
                    onClick={(e) => setInterview(true)}
                />
            }

            {
                props.interview && <ActiveModal
                    modalOpen={interview}
                    closeModal={setInterview}
                    setErrorText={props.setErrorText}
                    newStatus="interview"
                    projectID={props.projectID}
                    studentID={props.studentID}
                    text={<p className="px-1 font-semibold">Move the status of this application to interview</p>}
                    textArea={true}
                />
            }

            <DeclineButton
                onClick={(e) => setReject(true)}
            />

            <ActiveModal
                modalOpen={reject}
                closeModal={setReject}
                setErrorText={props.setErrorText}
                newStatus="rejected"
                projectID={props.projectID}
                studentID={props.studentID}
                text={<p className="px-1 font-semibold">Reject this student <span className="text-red-500">(This is irreversible)</span></p>}
            />

        </div>
    )

}


export { AcceptInterviewReject };