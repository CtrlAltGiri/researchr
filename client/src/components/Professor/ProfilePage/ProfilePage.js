import React, { useState } from 'react';
import ProfileRow from './ProfileRow';
import ProfileSection from './ProfileSection';
import EditProfile from './EditProfile';


function ProfilePage(props) {

    const [modalOpen, setModalOpen] = useState(false);

    return (
        <section className="px-12 md:px-24 py-4">
            <div name="intro-section" className="flex flex-col md:flex-row md:justify-between">
                <div className="">
                    <p className="text-3xl font-semibold">Dr. Giridhar Balachandran</p>
                    <p className="text-xl font-thin">Assistant Professor</p>
                    <p className="text-xl font-thin">IIT Madras</p>
                    <a href="https://manipal.edu/giridhar"><p className="text-lg font-normal">manipal.edu/giridharpandey</p></a>
                </div>

            </div>

            <div className="fixed bottom-0 right-0 w-auto h-16 mr-12 mb-2 cursor-pointer" onClick={e => setModalOpen(true)}>
                <p className="px-4 py-2 bg-teal-500 text-white rounded-full font-medium">Edit Profile</p>
            </div>

            <div className="px-0 md:px-6 mt-12">

                <ProfileRow 
                    section1Name={"Areas of interest"}
                    section2Name={"Courses Taught"}
                    data1={['Computer Networks and Security', 'Reinforcement learning']}
                    data2={['Formal Languages and Automata Theory', 'Data Structures and Algorithms']}
                />

                <ProfileRow
                    section1Name="Education"
                    section2Name="Books" 
                    data1={["Phd. at Stanford in Computer Science and Engineering (1999)", "MTech. at Manipal in Computer Science and Engineering (2000)"]}
                    data2={['Data Structures and Algorithms using C# using', 'Machine Learning using Tensorflow', 'Crazy fuzzy algorithms in C', 'Major imprvoments in Pytorch in 2020']}
                />

                <ProfileSection
                    sectionName="Publications"
                    data={['IEEE All Access conference (2019.) Dr. Pandey, Mr. Radhakrishnan', 'Artificial Intelligence']}
                    extraClass="md:w-full"
                />

                <ProfileSection
                    sectionName="Projects"
                    data={['New range machines for building technologies', 'Built an API generation engine using unreal']}
                    extraClass="md:w-full"
                />

                <ProfileSection
                    sectionName="Patents"
                    data={['New range machines for building technologies', 'Built an API generation engine using unreal']}
                    extraClass="md:w-full mb-12"
                />

            </div>

            <EditProfile 
                modalOpen={modalOpen}
                closeModal={(e) => setModalOpen(false)}
            />

        </section>
    )
}

export default ProfilePage;