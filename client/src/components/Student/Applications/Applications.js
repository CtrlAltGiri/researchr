import React, { useState, useEffect } from 'react';
import Table from './Table'
import axios from 'axios';
import { Error } from '../../General/Form/FormComponents';

function Applications() {

    const [appType, setAppType] = useState(1);
    const [applications, setApplications] = useState({})
    const [errorText, setShowError] = useState("")
  
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

    function removeErrorAndMove(val){
      setShowError('');
      setAppType(val);
    }

    return (
      <section className="text-gray-700 body-font overflow-hidden">

        <div className="container px-5 py-4 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Applications</h1>
            <div className="flex mx-auto border-2 border-teal-500 rounded overflow-hidden mt-4">
              <button onClick={(e) => removeErrorAndMove(1)} className={`py-1 px-4 border-r-2 border-teal-500 focus:outline-none ${appType === 1 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Active</button>
              <button onClick={(e) => removeErrorAndMove(2)} className={`py-1 px-4 border-r-2 border-teal-500 focus:outline-none ${appType === 2 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Selected</button>
              <button onClick={(e) => removeErrorAndMove(3)} className={`py-1 px-4 focus:outline-none ${appType === 3 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Archived</button>
            </div>
          </div>
        </div>
  
        {   
            appType === 1 ? <Table app={applications.active} setError={(val) => setShowError(val)}/>
            : appType === 2 ? <Table app={applications.selected} setError={(val) => setShowError(val)} selected={true}/> 
            : <Table app={applications.archived} setError={(val) => setShowError(val)} /> 
        }
        
        <div className="flex justify-center mb-8">
          <Error text={errorText} />
        </div>
  
      </section>
    )
  }

export default Applications;