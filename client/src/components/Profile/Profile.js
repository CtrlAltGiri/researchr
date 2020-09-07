import React, { useState, useEffect } from 'react';
import ExperienceSection from './ExperienceSection';
import axios from 'axios';

function Profile(props) {

    const [profile, setProfile] = useState({});

    useEffect(() => {
        axios.get('/api/profile/myProfile')
        .then(function(response){
            setProfile(response.data);
        })
    }, []);

    return (
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
                    subtitle="company"
                    name="position"
                    description="experience"
                />

                <ExperienceSection 
                    type="Projects"
                    experiences={profile.projects}
                    subtitle="tags"
                    name="title"
                    description="experience"
                /> 
                
                <ExperienceSection
                    type="Education"
                    experiences={profile.education && profile.education.college}
                    subtitle="branch"
                    name="college"
                    description="experience"
                />

            </div>
        </section>
    )

}

export default Profile;
