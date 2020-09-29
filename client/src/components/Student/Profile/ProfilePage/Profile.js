import React, { useState, useEffect } from 'react';
import ExperienceSection from './ExperienceSection';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { Error } from '../../../General/Form/FormComponents';

function Profile(props) {

    const studID = useParams();
    const [profile, setProfile] = useState({});
    const [errorText, setShowError] = useState('');

    useEffect(() => {
        if (studID.studentID) {

            let apiURL = (props.apiURL ? props.apiURL : '/api/student/profile/') + studID.studentID;
            axios.get(apiURL, { params: { cvElements: false } })
                .then(response => {
                    setProfile(response.data);
                })
                .catch(err => {
                    setShowError(err.response.data);
                })
        }
        else{
            setShowError("Not a valid URL");
        }
    }
    ,[studID]);

    return (
        <section className="text-gray-700 body-font">
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-wrap w-full mb-12">
                    <div className="lg:w-1/2 w-full mb-6 lg:mb-0">
                        {profile.name && <h1 className="sm:text-3xl text-2xl font-medium title-font mb-2 text-gray-900">{profile.name}</h1>}
                        {profile.c_email && <p className="lg:w-1/2 w-full leading-relaxed text-base">College Email: {profile.c_email}</p>}
                        <div className="flex flex-col space-2">
                            {profile.mine && <Link to="/student/profile/createProfile" className="underline cursor-pointer">Edit Profile</Link>}
                            {profile.mine && <Link to="/student/profile/changePassword" className="underline cursor-pointer">Change Password</Link>}
                        </div>
                    </div>
                </div>

                {profile.cvElements && <div>

                    {profile.cvElements.workExperiences && profile.cvElements.workExperiences.length > 0 &&
                        <ExperienceSection
                            type="Work Experience"
                            experiences={profile.cvElements.workExperiences}
                            subtitle="position"
                            name="organization"
                            description="experience"
                            logoURL="logoURL"
                            displayModal={['Position', 'Start Date', 'End Date', 'experience', 'URL (Proof)']}
                            displayParams={['position', 'startDate', 'endDate', 'experience', 'proof']}

                        />}

                    {profile.cvElements.projects && profile.cvElements.projects.length > 0 &&
                        <ExperienceSection
                            type="Projects"
                            experiences={profile.cvElements.projects}
                            research="researchProject"
                            name="title"
                            description="experience"
                            displayModal={['Professor', 'College', 'Start Date', 'End Date', 'URL (Proof)', 'Experience']}
                            displayParams={['professor', 'college', 'startDate', 'endDate', 'proof', 'experience']}
                        />}

                    {profile.cvElements.education && profile.cvElements.education.college && profile.cvElements.education.college.length > 0 &&
                        <ExperienceSection
                            type="Education"
                            experiences={profile.cvElements.education && profile.cvElements.education.college}
                            subtitle="branch"
                            name="college"
                            logoURL="e"
                            description="experience"
                            displayModal={['Degree', 'Year of Graduation', 'CGPA (out of 10)', 'Experience', 'Coursework']}
                            displayParams={['degree', 'yog', 'cgpa', 'experience', 'coursework']}
                        />}
                </div>
                }
                <Error text={errorText} />
            </div>

            {
                errorText.length === 0 && profile.cvElements && <div className="flex justify-end mr-6 mb-4 underline">
                    <a href="https://clearbit.com">Logos provided by ClearBit</a>
                </div> 
            }
        </section>
    )

}

export default Profile;