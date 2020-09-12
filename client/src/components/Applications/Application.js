import React, { useState } from 'react';
import Statusbadge from './Statusbadge';
import ReactModal from 'react-modal';
import { RedButton, TealButton } from '../General/Form/FormComponents';
import { Redirect, useHistory } from 'react-router-dom'


function Application(props) {

    const [modalOpen, setModalOpen] = useState(false);
    const [decision, setDecision] = useState();
    const [refresh, setRefresh] = useState(false);

    ReactModal.setAppElement(document.getElementById('root'));

    function applicationChange(){
        if(decision === "accept"){
            // MAKE POST REQUEST
            console.log("accept");
        }
        else{
            // MAKE POST REQUEST
            console.log("decline");
        }
        setModalOpen(false);
        setRefresh(true);
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
                <p className="text-gray-900 whitespace-no-wrap text-center">{"API Extraction of Bio species"}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div className="flex flex-none">
                    <div className="mx-auto flex items-center">
                        <div className="flex-shrink-0 w-10 h-10">
                            <img className="w-full h-full rounded-full"
                                src="/images/defaultProfile.png"
                                alt="" />
                        </div>
                        <p className="ml-4 font-medium text-md">{props.name}</p>
                    </div>
                </div>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">
                    {props.createDate}
                </p>
            </td>
            <td className="py-5 border-b border-gray-200 bg-white text-sm mb-1">
                <div className="flex items-center">
                    <Statusbadge badge={props.status} />
                </div>
                {props.selected ?
                    <div className="flex justify-around">
                        <button onClick={(e) => setButton('accept')} className="focus:outline-none">Accept</button>
                        <button onClick={(e) => setButton('decline')} className="focus:outline-none">Decline</button>
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
                {decision === 'accept' ? <p className="mb-4">This will result in all other applications being <span className="text-red-500">cancelled.</span></p>
                    : <p className="mb-4">This will move this application to archived (this is <span className="text-red-500">non-reversable</span>)</p>
                }

                {decision === 'accept' ?
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

        </tr>
    );


}

export default Application;