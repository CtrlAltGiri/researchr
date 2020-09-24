import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { TealButton, TextField } from '../../General/Form/FormComponents';

function Messages(props) {

    const [messages, setMessages] = useState(props.messages || []);
    const [newMessage, setNewMessage] = useState('')

    useEffect(() => {

        // call get only from professor profile.
        if (props.professor && messages && messages.length === 0) {
            axios.get("/api/message/" + props.projectID, {
                params: {
                    studentID: props.studentID,
                    projectID: props.projectID
                }
            })
                .then(res => setMessages(res.data))
                .catch(err => console.log(err.response.data));
        }
    }, []);


    function sendNewMessage() {
        if (newMessage.length > 0) {
            axios.post("/api/message/" + props.projectID, {
                studentID: props.studentID,
                message: newMessage
            })
                .then(res => {
                    setMessages([...messages, { message: newMessage, fromProf: true }])
                    setNewMessage('');
                })
                .catch(err => console.log(err.response.data))
        }
    }

    return (

        <div className="py-8 flex flex-col px-2 md:px-8">
            {messages && messages.map(message => {
                if (!(message.fromProf ^ !!props.professor)) {
                    return (<span key={message.timestamp} className="ml-2 my-2 self-end px-3 py-2 bg-teal-400 rounded-lg">{message.message}</span>)
                }
                else {
                    return (<span key={message.timestamp} className="my-2 mr-2 px-3 py-2 bg-red-300 rounded-lg self-start">{message.message}</span>)
                }
            })}

            <TextField
                text="Enter a new message"
                fieldExtraClass="w-full"
                extraClass="my-4"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
            />

            <TealButton
                text="Send Message"
                divClass="flex justify-center"
                submitForm={e => sendNewMessage()}
            />

        </div>
    )


}

export default Messages;    