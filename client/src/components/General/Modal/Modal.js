import React from 'react';
import ReactModal from 'react-modal';
import { Title, CloseButton } from '../../General/Form/FormComponents';

function Modal(props){
    return(
        <ReactModal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
        >
            <div className="flex flex-col w-full">
                <div className="flex flex-col">

                    <div className="flex flex-row justify-between">
                        <Title text={props.text} />
                        <CloseButton onClick={props.closeModal} />
                    </div>
                
                </div>
            </div>

            {props.children}

        </ReactModal>
    );
}

export default Modal;