import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectPage from '../../Student/ProjectSection/ProjectPage/ProjectPage';
import AddProject from '../LandingPage/AddProject';

function ProjectPageProfessor(props) {

    const { projectID } = useParams();
    const [modalOpen, setModalOpen] = useState(false);
    const [projDetails, setProjDetails] = useState(undefined);

    return (
        <div>
            <ProjectPage
                url="/api/student/project/5f5bbc5d4bbed985c4a72c50"
                professor={true}        // MAKE THIS TRUE ONLY IF MINE IS TRUE
                retProjDetails={setProjDetails}
                editAction={() => setModalOpen(true)}
            />

            {projDetails && <AddProject
                editMode={true} 
                modalOpen={modalOpen}
                closeModal={(e) => setModalOpen(false)}
                projDetails={projDetails}
            />}
        
        </div>
    )
}

export default ProjectPageProfessor;