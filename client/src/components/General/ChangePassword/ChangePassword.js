import React, { useState } from 'react';
import axios from 'axios';
import { TealButton, TextField, Title, Error } from '../Form/FormComponents';

function ChangePassword(props){

    const [oldPassword, setOldPassword] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassConfirm, setNewPassConfirm] = useState('');
    const [showError, setShowError] = useState('');

    function changePass(passes){
        if(newPass === newPassConfirm && newPass !== oldPassword){

            let apiEndpoint = props.professor ? '/api/student/password' : '/api/professor/password';
            axios.post(apiEndpoint, {
                current_password: passes.oldPassword,
                new_password: passes.newPass,
                confirm_new_password: passes.newPassConfirm
            })
            .then(res => {
                setOldPassword('');
                setNewPass('');
                setNewPassConfirm('');
                setShowError('Password has been updated successfully');
            })
            .catch(err => {
                setShowError(err.response.data);
            })
        }
        else{
            setShowError("Please enter all fields correctly.")
        }
    }

    return(
        <div className ="flex flex-col px-12 py-6">
            <Title
                text="Change Password"
            />

            <TextField
                text="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                name="oldpass"
                extraClass="mb-6"
                fieldExtraClass="w-3/4 md:w-1/2"
                type="password"
            />

            <TextField
                text="New Password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                name="newpass"
                extraClass="mb-6"
                fieldExtraClass="w-3/4 md:w-1/2"
                type="password"
            />

            <TextField
                text="Confirm new password"
                value={newPassConfirm}
                onChange={(e) => setNewPassConfirm(e.target.value)}
                name="newpassconfirm"
                extraClass="mb-12"
                fieldExtraClass="w-3/4 md:w-1/2"
                type="password"
            />


            <TealButton
                text="Change Password"
                submitForm={(e) => changePass({
                    oldPassword: oldPassword,
                    newPass: newPass,
                    newPassConfirm: newPassConfirm
                })}
                extraClass="mb-8"
            />

            <Error text={showError} />

        </div>
    )

}

export default ChangePassword;