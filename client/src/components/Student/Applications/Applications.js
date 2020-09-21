import React, { useState, useEffect } from 'react';
import Table from '../../General/Table/Table';
import Tabs from '../../General/Tabs/Tab';
import axios from 'axios';
import { Error } from '../../General/Form/FormComponents';

function Applications() {

    const [appType, setAppType] = useState(0);
    const [applications, setApplications] = useState({});
    const [errorText, setShowError] = useState("");
  
    useEffect(() => {
        axios.get("/api/student/applications")
        .then(res => {
          if(res)
            setApplications(res.data)
          else
            setShowError('Unknown error, please report this bug.')
        })
        .catch(err => setShowError(err.response.data));
    }, [])

    function removeError(val){
      setAppType(val)
      setShowError('');
    }

    const headers = ["Project", "Professor", "Details", "Application Date", "Status"]

    return (
      <section className="text-gray-700 body-font overflow-hidden">
      
        <Tabs
          text="Applications"
          tab={appType}
          data={['Active', 'Selected', 'Archived']}
          onClick={removeError}
        />
  
        {   
            appType === 0 ? <Table headers={headers} app={applications.active} setError={(val) => setShowError(val)}/>
            : appType === 1 ? <Table headers={headers} app={applications.selected} setError={(val) => setShowError(val)} selected={true}/> 
            : <Table headers={headers} app={applications.archived} setError={(val) => setShowError(val)} /> 
        }
        
        <div className="flex justify-center mb-8">
          <Error text={errorText} />
        </div>
  
      </section>
    )
  }

export default Applications;