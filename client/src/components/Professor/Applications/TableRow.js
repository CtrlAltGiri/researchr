import React from 'react';
import { Link } from 'react-router-dom'
import Statusbadge from '../../Student/Applications/Statusbadge';
import { AcceptInterviewReject } from './Utils';

function TableRow(props) {

    return (
        <tr>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center"><Link className="underline" to={"/student/profile/" + props.studentID}>{props.name}</Link></p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.college}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.branch}</p>
            </td>
            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p className="text-gray-900 whitespace-no-wrap text-center">{props.cgpa}</p>
            </td>
            {props.status && <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                {
                    props.status === 'active' ? <AcceptInterviewReject interview={true} accept={true} studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                        props.status === 'interview' ? <AcceptInterviewReject accept={true} studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                            props.status === 'selected' ? <AcceptInterviewReject studentID={props.studentID} projectID={props.projectID} setErrorText={props.setErrorText} /> :
                                (props.status === 'declined' || props.status === 'cancelled' || props.status === 'rejected') && <div className="flex items-center mb-2"><Statusbadge badge={props.status} /></div>
                }
            </td>
            }

            {props.status && (props.status === 'selected' || props.status === 'interview') &&
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center mb-2"><Statusbadge badge={props.status} /></div>
                </td>
            }
        </tr>
    )


}
export default TableRow;
