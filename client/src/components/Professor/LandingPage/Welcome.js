import React from 'react';

function Welcome(props){

    return (
        <div className="px-8 md:px-16">
            <h1 className="text-3xl font-bold">Welcome to researchR</h1>
            <p className="mb-12">To get you started, there are a couple of things</p>
            <div className="px-4 md:px-8">
                <p className="text-xl font-thin my-2">1. Create your profile in My Profile (so that students can view it)</p>
                <p className="text-xl font-thin my-2">2. Add Project(s) using the Add Project (+) button on this page.</p>
            </div>
        </div>
    )
}

export default Welcome;