import React, { useState, useEffect } from 'react';
import Table from './Table'
import axios from 'axios';
import { Error } from '../General/Form/FormComponents';

function Applications() {

    const [appType, setAppType] = useState(1);
    const [applications, setApplications] = useState({})
    const [errorText, setShowError] = useState("")
  
    useEffect(() => {
        axios.get("/api/applications")
        .then(res => {setApplications(res.data)})
        .catch(err => setShowError(err.response.data));
    }, [])

    return (
      <section className="text-gray-700 body-font overflow-hidden">

        <div className="container px-5 py-4 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">Applications</h1>
            <div className="flex mx-auto border-2 border-teal-500 rounded overflow-hidden mt-4">
              <button onClick={(e) => setAppType(1)} className={`py-1 px-4 border-r-2 border-teal-500 focus:outline-none ${appType === 1 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Active</button>
              <button onClick={(e) => setAppType(2)} className={`py-1 px-4 border-r-2 border-teal-500 focus:outline-none ${appType === 2 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Selected</button>
              <button onClick={(e) => setAppType(3)} className={`py-1 px-4 focus:outline-none ${appType === 3 ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>Archived</button>
            </div>
          </div>
        </div>
  
        {   
            appType === 1 ? <Table app={applications.active}/>
            : appType === 2 ? <Table app={applications.selected} selected={true}/> 
            : <Table app={applications.archived} /> 
        }
        
        <Error text={errorText} />
  
      </section>
    )
  }

export default Applications;