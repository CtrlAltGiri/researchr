import { BandwidthLimitExceeded } from 'http-errors';
import React, { useRef } from 'react'

function Error(props){

    const btnRef = useRef()
    
    function Ban(){
        console.log("not disabled lool");
        btnRef.current.setAttribute("disabled", "true")
    }

    return <button ref={btnRef} onClick={e => Ban()}>
        Please click here
    </button>
}

export default Error;