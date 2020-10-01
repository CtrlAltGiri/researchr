import React, { useState, useEffect } from 'react';
import Projectblock from './Projectblock';
import axios from 'axios';
import AddProject from './AddProject';
import { Error } from '../../General/Form/FormComponents';
import Welcome from './Welcome';

function LandingPage(props) {

    const [projects, setProjects] = useState(undefined);
    const [college, setCollege] = useState("")
    const [modalOpen, setModalOpen] = useState(false);
    const [errorText, setErrorText] = useState('')
    
    useEffect(() => {
        axios.get('/api/professor/projects')
        .then(res => {setProjects(res.data.projects); setCollege(res.data.college)})
        .catch(err => setErrorText(err.response.data));
    }, [])


    return (
        <section className="text-gray-700 body-font mb-8">
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-col md:flex-row md:flex-wrap -m-4">
                    {projects && (projects.length > 0 ? 
                        projects.map(project => 
                            <Projectblock key={project._id} project={project} college={college}/>)
                        :
                        <Welcome />)
                    }

                </div>
                <div className="fixed bottom-0 right-0 w-auto h-16 mr-12 mb-2 cursor-pointer" onClick={(e) => setModalOpen(true)}>
                    <p className="px-4 py-2 bg-teal-500 text-white rounded-full font-medium">Add Project (+)</p>
                </div>   
            </div>
        
            <AddProject 
                modalOpen={modalOpen}
                closeModal={(e) => setModalOpen(false)}
                college={college}
            />

            <Error divClass="flex justify-center" text={errorText} />
            
        </section>

    )

}

export default LandingPage;