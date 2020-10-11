import { BandwidthLimitExceeded } from 'http-errors';
import React, { Component, useRef, useState } from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle';
import '../../assets/datepicker.css'


function Error(props){

    return <MyApp />
}

function MyApp() {
    const [value, onChange] = useState(new Date());
  
    return (
      <div>
        <DatePicker
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }

export default Error;