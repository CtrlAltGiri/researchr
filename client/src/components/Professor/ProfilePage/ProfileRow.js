import React from 'react';
import ProfileSection from './ProfileSection';

function ProfileRow(props) {

    return (
        <div className="flex flex-col md:flex-row md:flex-wrap">

            {props.data1 && props.data1.length > 0 &&
                <ProfileSection
                    sectionName={props.section1Name}
                    data={props.data1}
                />
            }

            {props.data2 && props.data2.length > 0 &&
                <ProfileSection
                    sectionName={props.section2Name}
                    data={props.data2}
                />
            }

        </div>
    )

}

export default ProfileRow;