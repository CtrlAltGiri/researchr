import React from 'react';
import ReactModal from 'react-modal';
import { Title, CloseButton, BackButton } from '../../General/Form/FormComponents';

function Modal(props){

    ReactModal.setAppElement('#root');
    return(
        <ReactModal
            isOpen={props.modalOpen}
            onRequestClose={props.closeModal}
        >
            <div className="flex flex-col w-full">
                <div className="flex flex-col">

                    <div className="flex flex-row justify-between">
                        {props.backButton ? <BackButton extraClass="mb-8" onClick={props.backButtonClick}/>
                        : <Title text={props.text} />}
                        <CloseButton onClick={props.closeModal} />
                    </div>
                    {props.backButton && <Title text={props.text} />}
                
                </div>
            </div>

            {props.children}

        </ReactModal>
    );
}

export default Modal;