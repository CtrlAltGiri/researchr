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
                            name={experience.name}
                            startDate={experience.startDate}
                            endDate={experience.endDate}
                            title={experience.title}
                            description={experience.description}
                            url={experience.url}
                        />
                    );
                })}
            </div>
        </div>
    )
}

export default ExperienceSection;