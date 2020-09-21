import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tabs from '../../General/Tabs/Tab';
import { ActiveTable } from './Tables';
import { Error } from '../../General/Form/FormComponents';
import { useParams } from 'react-router-dom';

function Applications(props) {

    const { projectID } = useParams();
    const [active, setActive] = useState([]);
    const [selected, setSelected] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [archived, setArchived] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [appType, setAppType] = useState(0);

    useEffect(() => {
        axios.get('/api/professor/applications/' + projectID.toString())
            .then(res => {
                setActive(res.data.active);
                setSelected(res.data.selected);
                setOngoing(res.data.ongoing);
                setArchived(res.data.archived);
            })
            .catch(err => {
                setErrorText(err.response.data);
            });
    }, [])

    return (
        <div>
            <Tabs
                text={<p>Applications for <span className="text-teal-500">project_name</span></p>}
                onClick={setAppType}
                tab={appType}
                data={['Active', 'Selected', 'Ongoing', 'Archived']}
            />

            {
                appType === 0 ?
                    <ActiveTable
                        projectID={projectID}
                        setErrorText={setErrorText}
                        headers={['Student', 'College', 'Branch', 'CGPA', 'Action']}
                        data={active}
                    />
                    : appType === 1 ?
                        <ActiveTable
                            projectID={projectID}
                            setErrorText={setErrorText}
                            headers={['Student', 'College', 'Branch', 'CGPA', 'Action', 'Status']}
                            data={selected}
                        /> : appType === 2 ? 
                            <h1>Feedback</h1> 
                            :
                            <ActiveTable
                                projectID={projectID}
                                headers={['Student', 'College', 'Branch', 'CGPA', 'Status']}
                                setErrorText={setErrorText}
                                data={archived}
                            />
            }

            <div className="flex justify-center">
                <Error 
                    text={errorText} 
                />
            </div>


        </div>
    );

}

export default Applications;