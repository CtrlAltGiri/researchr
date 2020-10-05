import React from 'react';

function NoApplications(props) {
    return (
        <div className="flex flex-row justify-center mt-24">
            <p className="text-red-700 text-lg font-medium">No applications here! (in the {props.status} status)</p>
        </div>
    )
}

export default NoApplications;