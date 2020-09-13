import React from 'react'

function Error(props){
    return (
        <p>Error, not found.{props.errorCode && props.errorCode}</p>
        
    );
}

export default Error;