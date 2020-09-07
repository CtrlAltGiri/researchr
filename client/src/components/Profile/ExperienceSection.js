import React from 'react';
import Experience from './Experience'

function ExperienceSection(props) {

    return (
        <div className="mb-12">
            <span className="text-2xl text-black">{props.type}</span>
            <div class="flex flex-wrap -m-4 mt-4">
                {props.experiences && props.experiences.map(experience => {
                    return (
                        <Experience
                            name={experience[props.name]}
                            startDate={experience[props.startDate]}
                            endDate={experience[props.endDate]}
                            title={experience[props.subtitle]}
                            description={experience[props.description]}
                            url={"microsoft.com"}
                            research={experience[props.research] ? "Research Project" : "Self Project"}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default ExperienceSection;