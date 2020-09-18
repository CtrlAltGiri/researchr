import React, { useState } from 'react';
import { TealButton, TextField } from '../../General/Form/FormComponents';
import Modal from '../../General/Modal/Modal';
import TagInput from '../../General/TagInput/TagInput';

function EditProfile(props) {

    const [profileDetails, setProfileDetails] = useState({});

    function updateTags(newValue, name) {
        setProfileDetails({ ...profileDetails, [name]: newValue });
    }

    return (
        <Modal
            modalOpen={props.modalOpen}
            closeModal={props.closeModal}
            text="Create / Edit your profile"
        >

            <TagInput
                text="Areas of interest"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.areasOfInterest}
                name="areasOfInterest"
                maxNumberOfTags={5}
                noSuggestions={true}
                heading="Chosen areas"
                allCases={true}
            />

            <TagInput
                text="Publications"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.publications}
                name="publications"
                maxNumberOfTags={10}
                noSuggestions={true}
                heading="Publications entered"
                allCases={true}
            />

            <TagInput
                text="Books"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.books}
                name="books"
                maxNumberOfTags={5}
                noSuggestions={true}
                heading="Books published"
                allCases={true}
            />

            <TagInput
                text="Courses Taught"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.courses}
                name="courses"
                maxNumberOfTags={5}
                noSuggestions={true}
                heading="Courses selected"
                allCases={true}
            />

            <TagInput
                text="Projects"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.projects}
                name="projects"
                maxNumberOfTags={10}
                noSuggestions={true}
                heading="Projects / Patents"
                allCases={true}
            />

            <TagInput
                text="Patents"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.patents}
                name="patents"
                maxNumberOfTags={10}
                noSuggestions={true}
                heading="Patents"
                allCases={true}
            />          

            <TagInput
                text="Education - Ex. PhD. in Imperial College, specializing in Computer Science (1999)"
                extraClass="flex mt-4 flex-col"
                fieldExtraClass="w-4/5"
                updateTags={updateTags}
                chosenTags={profileDetails.education}
                name="education"
                maxNumberOfTags={5}
                noSuggestions={true}
                heading="Education"
                allCases={true}
            />

            <TextField
                text="URL to website"
                fieldExtraClass="w-3/5"
                extraClass="mt-6"
                onChange={(e) => updateTags(e.target.name, e.target.value)}
                name="url"
                value={profileDetails.url}
            />  

            <div className="flex justify-end">
                <TealButton
                    text="Submit"
                    extraClass="mr-8 mt-8 mb-4"
                />
            </div>

        </Modal>

    )

}

export default EditProfile;