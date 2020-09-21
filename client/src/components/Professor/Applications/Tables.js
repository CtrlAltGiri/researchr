import React from 'react';
import Table from '../../General/Table/Table';
import TableRow from './TableRow';

function ActiveTable(props) {
    return (
        <Table
            setError={props.setErrorText}
            headers={props.headers}
        >
            {props.data && props.data.map((application) => {
                return (
                    <TableRow
                        studentID={application.studentID}
                        projectID={props.projectID}
                        name={application.name}
                        college={application.college}
                        branch={application.branch}
                        cgpa={application.cgpa}
                        status={application.status}
                        setErrorText={props.setErrorText}
                        key={application.name+application.college+application.cpga+application.branch}
                        sop={application.sop}
                        questionnaire={props.questionnaire}
                        answers={application.answers || []}
                    />
                )
            })}

        </Table>
    )
}

export { ActiveTable };