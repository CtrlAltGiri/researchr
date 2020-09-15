import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios';
import ReactModal from 'react-modal';
import { RedButton, TealButton } from '../../General/Form/FormComponents';
import Statusbadge from './Statusbadge';

function Application(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [profMessageModal, setProfMessageModal] = useState(false);
    const [decision, setDecision] = useState();
    const [refresh, setRefresh] = useState(false);

    ReactModal.setAppElement(document.getElementById('root'));

    function applicationChange(){
        setModalOpen(false);
        axios.post("/api/student/applications", {
            projectID: props.projID,
            status: decision
        })
        .then(res => {
            setRefresh(true);
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
            {/*The below line of code is to ensure they reload the page*/}
            {refresh && <Redirect to='/student'/>}
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
                        {props.selected && <button className="focus:outline-none underline text-teal-700 cursor-pointer" onClick={(e) => {setProfMessageModal(true)}}>Message from Professor</button>}
                        </div>
                    </div>
                </div>
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
                        <button onClick={(e) => setButton('ongoing')} className="focus:outline-none">
                        <svg className="svg-icon-teal-small" viewBox="0 0 20 20">
							<path fill="none" d="M7.629,14.566c0.125,0.125,0.291,0.188,0.456,0.188c0.164,0,0.329-0.062,0.456-0.188l8.219-8.221c0.252-0.252,0.252-0.659,0-0.911c-0.252-0.252-0.659-0.252-0.911,0l-7.764,7.763L4.152,9.267c-0.252-0.251-0.66-0.251-0.911,0c-0.252,0.252-0.252,0.66,0,0.911L7.629,14.566z"></path>
						</svg>
                        </button>
                        <button onClick={(e) => setButton('declined')} className="focus:outline-none">
                        <svg className="svg-icon-red-small" viewBox="0 0 20 20">
							<path fill="none" d="M15.898,4.045c-0.271-0.272-0.713-0.272-0.986,0l-4.71,4.711L5.493,4.045c-0.272-0.272-0.714-0.272-0.986,0s-0.272,0.714,0,0.986l4.709,4.711l-4.71,4.711c-0.272,0.271-0.272,0.713,0,0.986c0.136,0.136,0.314,0.203,0.492,0.203c0.179,0,0.357-0.067,0.493-0.203l4.711-4.711l4.71,4.711c0.137,0.136,0.314,0.203,0.494,0.203c0.178,0,0.355-0.067,0.492-0.203c0.273-0.273,0.273-0.715,0-0.986l-4.711-4.711l4.711-4.711C16.172,4.759,16.172,4.317,15.898,4.045z"></path>
						</svg>
                        </button>
                    </div>
                    : ""}
            </td>

            <ReactModal
                isOpen={modalOpen}
                onRequestClose={(e) => setModalOpen(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
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

            </ReactModal>

            <ReactModal
                isOpen={profMessageModal}
                onRequestClose={(e) => setProfMessageModal(false)}
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)'
                    }
                }}
            >

                {props.professorMsg ? props.professorMsg : "The professor has not left any message for you."}

            </ReactModal>

        </tr>
    );


}

export default Application;