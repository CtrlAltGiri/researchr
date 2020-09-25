import React, { useState } from 'react';
import { useHistory, Link } from 'react-router-dom'
import axios from 'axios';
import ReactModal from 'react-modal';
import { RedButton, TealButton } from '../../General/Form/FormComponents';
import { AcceptButton, DeclineButton } from '../../General/Form/Buttons';
import Statusbadge from './Statusbadge';
import SmallModal from '../../General/Modal/SmallModal';

function Application(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [decision, setDecision] = useState();
    const history = useHistory();

    ReactModal.setAppElement(document.getElementById('root'));

    function applicationChange(){
        setModalOpen(false);
        axios.post("/api/student/applications", {
            projectID: props.projID,
            status: decision
        })
        .then(res => {
            history.go(0);
        })
        .catch(err => {
            props.setError(err.response.data);
        });
    }

    function setButton(decision){
        setDecision(decision);
        setModalOpen(true);
    }
    
    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center"><Link className="underline" to={"/student/project/"+props.projID.toString()}>{props.name}</Link></p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex flex-none">
                    <div className="mx-auto flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-full h-full rounded-full"
                                src="/images/defaultProfile.png"
                                alt="" />
                        </div>
                        <div className="ml-4">
                            <p className="font-medium text-md">{props.professor}</p>
                        </div>
                    </div>
                </div>
            </td>
            <td className="text-center">
                <Link className="underline" target="_blank" to={"/student/application/" + props.projID}>{(props.status === "ongoing" || props.status === "selected" || props.status === "interview" || props.status === "completed") ? (props.messageCount ? ("Messages (" + props.messageCount + ")" + (props.status === "ongoing" ? " and Feedback": "" )): "Messages") :"Application" }</Link>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">
                    {props.createDate && (new Date(props.createDate).toDateString())}
                    {props.finalDate && props.status === "selected" && 
                        <p className="text-red-500 font-medium">Accept before: {new Date(props.finalDate).toDateString()}</p>
                    }
                </p>
            </td>
            <td className="py-5 border-b border-gray-200 bg-white text-sm mb-1">
                <div className="flex items-center mb-2">
                    <Statusbadge badge={props.status} />
                </div>
                {props.status === 'selected' ?
                    <div className="flex justify-around">
                        <AcceptButton
                            onClick={(e) => setButton('ongoing')}
                        />

                        <DeclineButton
                            onClick={(e) => setButton('declined')}
                        />

                    </div>
                    : ""}
            </td>

            <SmallModal
                isOpen={modalOpen}
                onRequestClose={(e) => setModalOpen(false)}
            >
                <p className="mb-4">Are you sure you want to {decision}?</p>
                {decision === 'ongoing' ? <p className="mb-4">This will result in all other applications being <span className="text-red-500">cancelled.</span></p>
                    : <p className="mb-4">This will move this application to archived (this is <span className="text-red-500">non-reversable</span>)</p>
                }

                {decision === 'ongoing' ?
                    <div className="flex justify-around">
                        <TealButton
                            text="Yes, accept"
                            extraClass="mx-2"
                            submitForm={(e) => applicationChange()}
                        />
                        <RedButton
                            text="Not sure"
                            extraClass="mx-2"
                            submitForm={(e) => setModalOpen(false)}
                        />
                    </div> :
                    <div className="flex justify-around">
                        <RedButton
                            text="Yes, decline"
                            extraClass="mx-2"
                            submitForm={(e) => applicationChange()}
                        />
                        <TealButton
                            text="Not sure"
                            extraClass="mx-2"
                            submitForm={(e) => setModalOpen(false)}
                        />
                    </div>
                }

            </SmallModal>

        </tr>
    );


}

export default Application;