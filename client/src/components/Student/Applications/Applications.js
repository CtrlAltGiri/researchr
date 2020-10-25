import React, { useState, useEffect } from 'react';
import Table from '../../General/Table/Table';
import Tabs from '../../General/Tabs/Tab';
import axios from 'axios';
import { Error } from '../../General/Form/FormComponents';
import SmallModal from '../../General/Modal/SmallModal';

function Applications() {

  const [appType, setAppType] = useState(0);
  const [applications, setApplications] = useState({});
  const [errorText, setShowError] = useState("");
  const [infoModal, setInfoModal] = useState(false);

  useEffect(() => {
    axios.get("/api/student/applications")
      .then(res => {
        if (res)
          setApplications(res.data)
        else
          setShowError('Unknown error, please report this bug.')
      })
      .catch(err => setShowError(err.response.data));
  }, [])

  function removeError(val) {
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
      <div className="flex justify-center ml-8" onClick={e => setInfoModal(true)}>
        <p className="text-gray-600 font-thin hover:underline cursor-pointer">What are these statuses?</p>
        <svg className="svg-icon cursor-pointer" viewBox="0 0 35 35">
          <path fill="none" d="M12.323,2.398c-0.741-0.312-1.523-0.472-2.319-0.472c-2.394,0-4.544,1.423-5.476,3.625C3.907,7.013,3.896,8.629,4.49,10.102c0.528,1.304,1.494,2.333,2.72,2.99L5.467,17.33c-0.113,0.273,0.018,0.59,0.292,0.703c0.068,0.027,0.137,0.041,0.206,0.041c0.211,0,0.412-0.127,0.498-0.334l1.74-4.23c0.583,0.186,1.18,0.309,1.795,0.309c2.394,0,4.544-1.424,5.478-3.629C16.755,7.173,15.342,3.68,12.323,2.398z M14.488,9.77c-0.769,1.807-2.529,2.975-4.49,2.975c-0.651,0-1.291-0.131-1.897-0.387c-0.002-0.004-0.002-0.004-0.002-0.004c-0.003,0-0.003,0-0.003,0s0,0,0,0c-1.195-0.508-2.121-1.452-2.607-2.656c-0.489-1.205-0.477-2.53,0.03-3.727c0.764-1.805,2.525-2.969,4.487-2.969c0.651,0,1.292,0.129,1.898,0.386C14.374,4.438,15.533,7.3,14.488,9.77z"></path>
        </svg>
      </div>

      {
        appType === 0 ? <Table headers={headers} app={applications.active} setError={(val) => setShowError(val)} />
          : appType === 1 ? <Table headers={headers} app={applications.selected} setError={(val) => setShowError(val)} selected={true} />
            : <Table headers={headers} app={applications.archived} setError={(val) => setShowError(val)} />
      }

      <SmallModal
        isOpen={infoModal}
        onRequestClose={e => setInfoModal(false)}
      >
        <img src="/images/student/student_flow.png" className="mx-auto w-3/5 hidden md:block" />
        <img src="/images/student/student_flow.png" style={{ "--transform-rotate": "90deg" }} className="transform rotate-90 my-64 block md:hidden" />

      </SmallModal>


      <div className="flex justify-center mb-8">
        <Error text={errorText} />
      </div>

    </section>
  )
}

export default Applications;