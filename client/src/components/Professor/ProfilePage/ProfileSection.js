import React from 'react';
import { Title } from '../../General/Form/FormComponents';

function ProfileSection(props) {
 
    return (
        <div name="profile-section" className={`w-full md:w-1/2 my-4 px-0 md:px-4 ${props.extraClass}`}>
            <Title text={props.sectionName} />
            <ul className="list-disc px-12">
                {props.data.map(t => {
                    return <li key={t + props.sectionName}>{t}</li>
                })}
            </ul>
        </div>
    )

}

export default ProfileSection;