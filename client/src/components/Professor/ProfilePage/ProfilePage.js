import React, { useState, useEffect } from 'react';
import ProfileRow from './ProfileRow';
import ProfileSection from './ProfileSection';
import EditProfile from './EditProfile';
import { Error } from '../../General/Form/FormComponents';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ChangePassword from '../../General/ChangePassword/ChangePassword';
import Modal from '../../General/Modal/Modal';
import ProfTitle from './ProfTitle';
import { FloatingButtonBottomRight } from '../../General/Form/Buttons'

function ProfilePage(props) {

    const { profileID } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [showError, setShowError] = useState('');
    const [allDetails, setAllDetails] = useState({})
    const [changePass, setChangePass] = useState(false);

    useEffect(() => {

        let apiURL = (props.apiURL ? props.apiURL : '/api/professor/profile/') + profileID;

        axios.get(apiURL)
            .then((res) => setAllDetails(res.data))
            .catch(err => setShowError(err.response.data))
    }, []);

    function checkValid(props) {
        if (props && props.length > 0) {
            return true;
        }
        return false;
    }

    function showFullProfile() {

        if (allDetails.profile) {
            let retVal = false;
            let vals = [allDetails.profile.areasOfInterest, allDetails.profile.courses, allDetails.profile.eductaion, allDetails.profile.books, allDetails.profile.publications, allDetails.profile.projects, allDetails.profile.patents]
            vals.every(val => {
                if (checkValid(val)) {
                    retVal = true;
                    return false;
                }
                return true;
            })
            return retVal;
        }
        else {
            return false;
        }
    }

    return (
        <section className="px-12 md:px-24 py-4">

            <ProfTitle
                name={allDetails.name}
                designation={allDetails.designation}
                college={allDetails.college}
                mine={allDetails.mine}
                url={allDetails.profile && allDetails.profile.url ? allDetails.profile.url : undefined}
                openModal={setChangePass}
                fullProfile={showFullProfile()}
            />

            {allDetails.mine &&
                <FloatingButtonBottomRight 
                    text="Edit Profile"
                    onClick={e => setModalOpen(true)}
                />
            }

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

                {allDetails.profile.publications && allDetails.profile.publications.length > 0 &&
                    <ProfileSection
                        sectionName="Publications"
                        data={allDetails.profile.publications}
                        extraClass="md:w-full my-8"
                    />}

                {allDetails.profile.projects && allDetails.profile.projects.length > 0 &&
                    <ProfileSection
                        sectionName="Projects"
                        data={allDetails.profile.projects}
                        extraClass="md:w-full my-8"
                    />}

                {allDetails.profile.patents && allDetails.profile.patents.length > 0 &&
                    <ProfileSection
                        sectionName="Patents"
                        data={allDetails.profile.patents}
                        extraClass="md:w-full my-12"
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

            <Modal
                modalOpen={changePass}
                closeModal={e => setChangePass(false)}
            >
                <ChangePassword
                    professor={true}
                />

            </Modal>

        </section>
    );
}

export default ProfilePage;