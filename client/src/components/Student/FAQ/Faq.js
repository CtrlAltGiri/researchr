import React from 'react';

function Faq(props){
    return(
        <div className="px-8 md:px-24 mb-12">
            <h1 className="text-3xl font-bold">Welcome to researchR</h1>
            <p className="mb-12">To get you started, here are a couple of instructions</p>
            <div className="px-4 md:px-8">
                <p className="text-xl font-thin my-2">1. Create your profile under My Profile -> Edit Profile before applying to projects.</p>
                <p className="text-xl font-thin my-2">2. Apply to projects using an SOP which will act as the first message to the professor</p>
                <p className="text-xl font-thin my-2">3. What are researchR Tags? <br /> <span className="font-normal">They are keywords used to match students and the professors correctly. So make sure you enter them correctly.</span></p>
                <p className="text-xl font-thin my-2">4. Where to change my password? <br /><span className="font-normal">You can update your password under the My Profile tab -> Update Password</span></p>
            </div>
        </div>
    )
}

export default Faq;