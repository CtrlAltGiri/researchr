import React, {useState, useEffect} from 'react';
import Table from '../../General/Table/Table';
import TableRow from './TableRow';
import Dropdown from '../../General/Dropdown/Dropdown';
import { branches } from '../../../common/data/collegeData';
import { TextField } from '../../General/Form/FormComponents';

function ActiveTable(props) {

    const [branch, setBranch] = useState('');
    const [cgpa, setCGPA] = useState('');
    const [data, setData] = useState(props.data)
    
    function retNewVals(){

        let x = props.data;
        if(branch && branch.length > 1){
            x = props.data.filter(d => d.branch === branch)
        }

        if(cgpa && cgpa.length > 0 && !isNaN(cgpa)){
            x = x.filter(d => Number(d.cgpa) >= Number(cgpa));
        }

        return x;
    }
    
    return (

        <div className="">

            <div className="flex flex-row w-full justify-around">
            
                <Dropdown
                    text="Branches"
                    changeDropdown={(val, name) => setBranch(val)}
                    name="filters"
                    val={branch}
                    placeholder="Branches"
                    extraClass="self-center"
                    fieldExtraClass="w-48 md:w-64"
                    options={[{value:"-", label:"All"}].concat(branches)}
                />
                        
                <TextField
                    text="CGPA (min.)"
                    extraClass="self-center"
                    fieldExtraClass="w-10 md:w-16"
                    value={cgpa}
                    onChange={(e) => setCGPA(e.target.value)}
                /> 
            </div>

            <Table
                setError={props.setErrorText}
                headers={props.headers}
            >
                {retNewVals().map((application) => {
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
                            key={application.name + application.college + application.cpga + application.branch}
                            sop={application.sop}
                            questionnaire={props.questionnaire}
                            answers={application.answers || []}
                        />
                    )
                })}

            </Table>

        </div>
    )
}

export { ActiveTable };