import React from 'react';

function Skill(props) {

    return (
        <div class="pr-2 w-full">
            <div class="bg-gray-200 rounded flex p-4 h-full items-center">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" class="text-teal-500 w-6 h-6 flex-shrink-0 mr-4" viewBox="0 0 24 24">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"></path>
                    <path d="M22 4L12 14.01l-3-3"></path>
                </svg>
                <span class="title-font font-medium">{props.skill}</span>
            </div>
        </div>
    )
}

export default Skill;