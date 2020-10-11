import React from 'react';
import ReactModal from 'react-modal';
import { CloseButton } from '../Form/FormComponents';

function SmallModal(props){
    ReactModal.setAppElement('#root');
    return(
        <ReactModal
            isOpen={props.isOpen}
            onRequestClose={props.onRequestClose}
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
            <CloseButton onClick={props.onRequestClose} />
            {props.children}

        </ReactModal>
    );
}

export default SmallModal;