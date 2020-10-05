import React, { useState, useEffect } from 'react';
import Projectblock from './Projectblock';
import axios from 'axios';
import AddProject from './AddProject';
import { Error } from '../../General/Form/FormComponents';
import Welcome from './Welcome';
import { FloatingButtonBottomRight } from '../../General/Form/Buttons'

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
                
                <FloatingButtonBottomRight 
                    text="Add Project (+)"
                    onClick={e => setModalOpen(true)}
                />  
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