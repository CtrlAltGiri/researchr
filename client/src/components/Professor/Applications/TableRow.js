import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import Statusbadge from '../../Student/Applications/Statusbadge';
import { AcceptInterviewReject } from './Utils';
import Modal from '../../General/Modal/Modal';
import { TextArea, TextField } from '../../General/Form/FormComponents';
import Messages from '../../General/Messaging/Messages';

function TableRow(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [messageModal, setMessageModal] = useState(true);

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center"><Link className="underline" to={"/student/profile/" + props.studentID} target="_blank">{props.name}</Link></p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.college}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.branch}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.cgpa}</p>
            </td>

            {props.status && (props.status === 'active' || props.status === 'selected' || props.status === 'interview') && <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                <p className="underline cursor-pointer" onClick={(e) => setModalOpen(true)}>View Application</p>
                {(props.status === 'selected' || props.status === 'interview') && <p className="underline cursor-pointer mt-2" onClick={e => setMessageModal(true)}>Messages</p>}
            </td>
            }

            {props.status && <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {
                    props.status === 'active' ? <AcceptInterviewReject interview={true} accept={true} studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                        props.status === 'interview' ? <AcceptInterviewReject accept={true} studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                            props.status === 'selected' ? <AcceptInterviewReject studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                                (props.status === 'declined' || props.status === 'cancelled' || props.status === 'rejected') && <div className="flex items-center mb-2"><Statusbadge badge={props.status} /></div>
                }
            </td>
            }

            {props.status && (props.status === 'selected' || props.status === 'interview') &&
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center mb-2"><Statusbadge badge={props.status} /></div>
                </td>
            }

            <Modal modalOpen={modalOpen} closeModal={(e) => setModalOpen(false)} text={props.name + "'s Application"}>
                <TextArea
                    text="Statement of purpose"
                    disabled={true}
                    value={props.sop}
                    rows={10}
                    extraClass="my-4"
                />

                {props.questionnaire.map((question, index) => {
                    return <TextArea
                        text={question}
                        disabled={true}
                        value={props.answers[index]}
                        rows={5}
                        key={question}
                        extraClass="my-4"
                    />
                })}

            </Modal>

            <Modal modalOpen={messageModal} closeModal={e => setMessageModal(false)} text={"Messages with " + props.name}>
                <Messages
                    messages={[{ fromProf: true, message: "Hi, please contact me at +91-9080034580" }, { fromProf: false, message: "Hi I am Giridhar" }]}
                    studentID={props.studentID}
                    projectID={props.projectID}
                    professor={true}
                />
            </Modal>

        </tr>
    )
}
export default TableRow;
