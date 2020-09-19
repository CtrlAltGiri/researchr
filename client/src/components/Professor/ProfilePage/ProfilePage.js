import React, { useState, useEffect } from 'react';
import ProfileRow from './ProfileRow';
import ProfileSection from './ProfileSection';
import EditProfile from './EditProfile';
import { Error } from '../../General/Form/FormComponents';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { all } from 'async';


function ProfilePage(props) {

    const { profileID } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [showError, setShowError] = useState('');
    const [allDetails, setAllDetails] = useState({})

    useEffect(() => {
        axios.get('/api/professor/profile/' + profileID)
            .then((res) => setAllDetails(res.data))
            .catch(err => setShowError(err.response.data))
    }, []);

    return (
        <section className="px-12 md:px-24 py-4">
            <div name="intro-section" className="flex flex-col md:flex-row md:justify-between">
                <div className="">
                    <p className="text-3xl font-semibold">{allDetails.name}</p>
                    <p className="text-xl font-thin">{allDetails.designation}</p>
                    <p className="text-xl font-thin">{allDetails.college}</p>
                    {allDetails.profile && allDetails.profile.url && <a href={allDetails.profile.url}><p className="text-lg font-normal">{allDetails.profile.url}</p></a>}
                </div>

            </div>

            <div className="fixed bottom-0 right-0 w-auto h-16 mr-12 mb-2 cursor-pointer" onClick={e => setModalOpen(true)}>
                <p className="px-4 py-2 bg-teal-500 text-white rounded-full font-medium">Edit Profile</p>
            </div>

            {allDetails.profile && <div className="px-0 md:px-6 mt-6">

                <ProfileRow
                    section1Name={"Areas of interest"}
                    section2Name={"Courses Taught"}
                    data1={allDetails.profile.areasOfInterest}
                    data2={allDetails.profile.courses}
                />

                <ProfileRow
                    section1Name="Education"
                    section2Name="Books"
                    data1={allDetails.profile.education}
                    data2={allDetails.profile.books}
                />

                {allDetails.profile.publications && <ProfileSection
                    sectionName="Publications"
                    data={allDetails.profile.publications}
                    extraClass="md:w-full"
                />}

                {allDetails.profile.projects && <ProfileSection
                    sectionName="Projects"
                    data={allDetails.profile.projects}
                    extraClass="md:w-full"
                />}

                {allDetails.profile.patents && <ProfileSection
                    sectionName="Patents"
                    data={allDetails.profile.patents}
                    extraClass="md:w-full mb-12"
                />}

            </div>
            }

            <Error text={showError} />

            {modalOpen && <EditProfile
                modalOpen={modalOpen}
                closeModal={(e) => setModalOpen(false)}
                profileDetails={allDetails.profile}
            />
            }

        </section>
    )
}

export default ProfilePage;