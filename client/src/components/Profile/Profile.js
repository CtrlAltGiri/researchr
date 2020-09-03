import React, { useState, useEffect } from 'react';
import ExperienceSection from './ExperienceSection';

function Profile(props) {

    const [profile, setProfile] = useState({});

    useEffect(() => {
        fetch('/api/myprofile', { mode: 'cors' })
            .then(res => res.json())
            .then(newProfile => setProfile(newProfile));
    }, [profile.name]);

    return (
        // <section class="text-gray-700 body-font overflow-hidden">
        //     <p className="px-12 text-3xl text-center mb-4">Work Experience</p>
        //     <div class="container px-5 py-8 mx-auto">
        //         <div class="-my-8">
        <section class="text-gray-700 body-font">
            <div class="container px-5 py-12 mx-auto">
                <div class="flex flex-wrap w-full mb-12">
                    <div class="lg:w-1/2 w-full mb-6 lg:mb-0">
                        <h1 class="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{profile.name}</h1>
                        <div class="h-1 w-20 bg-teal-500 rounded"></div>
                    </div>
                    <p class="lg:w-1/2 w-full leading-relaxed text-base">{profile.email}</p>
                </div>
                
                <ExperienceSection 
                    type="Work Experience"
                    experiences={profile.workExperiences}
                />

                <ExperienceSection 
                    type="Research Experience"
                    experiences={profile.researchExperiences}
                /> 
                
                <ExperienceSection
                    type="Education"
                    experiences={profile.education}
                />

            </div>
        </section>
    )

}

export default Profile;
