import React from 'react';

function DetailsTab(props) {
    const projDetails = props.projDetails;
    return (
        <div className="mt-8">
            {projDetails.startDate && <div className="flex py-2">
                <span className="text-gray-500">Start Date</span>
                <span className="ml-auto text-gray-900">{(new Date(projDetails.startDate)).toDateString()}</span>
            </div>}
            {projDetails.duration && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Duration</span>
                <span className="ml-auto text-gray-900">{projDetails.duration} weeks</span>
            </div>}
            {projDetails.location && <div className="flex border-t border-b border-gray-300 py-2">
                <span className="text-gray-500">Location</span>
                <span className="ml-auto text-gray-900">{projDetails.location}</span>
            </div>}
            {projDetails.professorName && <div className="flex py-2">
                <span className="text-gray-500">Professor's Name</span>
                <span className="ml-auto text-gray-900">{projDetails.professorName}</span>
            </div>}
            {projDetails.college && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Associated College</span>
                <span className="ml-auto text-gray-900">{projDetails.college}</span>
            </div>}
            {projDetails.professorDesignation && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Designation of Professor</span>
                <span className="ml-auto text-gray-900">{projDetails.professorDesignation}</span>
            </div>}
            {projDetails.applicationCloseDate && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Close date for application</span>
                <span className="ml-auto text-gray-900">{(new Date(projDetails.applicationCloseDate)).toDateString()}</span>
            </div>}
            {projDetails.commitment && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Commitment per week</span>
                <span className="ml-auto text-gray-900">{projDetails.commitment + " hours/week"}</span>
            </div>}
            {props.professor && projDetails.restrictedView !== undefined && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Visibility of Project</span>
                <span className="ml-auto text-gray-900">{(projDetails.restrictedView ? (projDetails.college ? projDetails.college : "Only my college") : "Everyone")}</span>
            </div>}
            {projDetails.tags && <div className="flex border-t border-gray-300 py-2">
                <span className="text-gray-500">Tags</span>
                <span className="ml-auto text-gray-900">{projDetails.tags.join(",")}</span>
            </div>}

        </div>
    )
}

export default DetailsTab;