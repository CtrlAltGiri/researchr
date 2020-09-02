import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Skill from './Skill'

const slideValues = {
    DESCRIPTION: "desc",
    SKILLS: "skills",
    DETAILS: "details"
}

function ProjectPage(props) {

    let {projectId} = useParams();
    {
        // use this to render appropriate page.
        // useEffect( () => {// call API with this projectId}) 
    }
    const [slider, setSlider] = useState(slideValues.DESCRIPTION);

    return (
        <section className="text-gray-700 body-font overflow-hidden">
            <div className="container px-5 py-12 mx-auto">
                <div className="lg:w-4/5 mx-auto flex flex-wrap">
                    <div className="lg:w-1/2 w-full lg:pr-10 lg:py-6 mb-6 lg:mb-0">
                        <h2 className="text-sm title-font text-gray-500 tracking-widest">DR GIRIDHAR BALACHANDRAN</h2>
                        <h1 className="text-gray-900 text-3xl title-font font-medium mb-4">API Extraction of boolean values using Support Vector Machines</h1>
                        <div className="flex mb-4 justify-between items-center pr-8">
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.DESCRIPTION ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.DESCRIPTION) }}>Description</a>
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.SKILLS ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.SKILLS) }}>Skills</a>
                            <a className={`py-2 text-lg px-1 cursor-pointer ${slider === slideValues.DETAILS ? "text-teal-500" : ""}`} onClick={(e) => { setSlider(slideValues.DETAILS) }}>Details</a>
                        </div>

                        {slider === slideValues.DESCRIPTION ?
                            <div>
                                <p className="leading-relaxed mb-4">This project entails the most complicated version of an API that allows a human to interact with the preciuos underlying areas of the skeletal system which makes sure that we can contribute to open source software that is hosted on the beautiful website called GitHub. Man what a whack thing it is though. I would much rather contribute to closed source software because it is more "cool"</p>
                                <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Date Start</span>
                                    <span className="ml-auto text-gray-900">10th July, 2020</span>
                                </div>
                                <div className="flex border-t border-gray-300 py-2">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="ml-auto text-gray-900">8 months</span>
                                </div>
                                <div className="flex border-t border-b mb-6 border-gray-300 py-2">
                                    <span className="text-gray-500">Location</span>
                                    <span className="ml-auto text-gray-900">Work from Home</span>
                                </div>
                                <div className="flex">
                                    <span className="title-font font-medium text-2xl text-gray-900">Popularr</span>
                                    <button className="flex ml-auto text-white bg-teal-500 border-0 py-2 px-6 focus:outline-none hover:bg-teal-600 rounded">Apply</button>
                                    <button className="rounded-full w-10 h-10 bg-gray-200 p-0 border-0 inline-flex items-center justify-center text-gray-500 ml-4">
                                        <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5" viewBox="0 0 24 24">
                                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            : slider === slideValues.SKILLS ?
                                <div class="flex flex-wrap w-full sm:mx-auto sm:mb-2 -mx-2">
                                    <Skill skill = "C/C++" />
                                </div>
                                : <h1>DETAILS</h1>
                        }


                    </div>
                    <img className="lg:w-1/2 w-full lg:h-auto h-64 object-cover object-center rounded" src="/images/lathe.jpg" />
                </div>
            </div>
        </section>
    )

}

export default ProjectPage;