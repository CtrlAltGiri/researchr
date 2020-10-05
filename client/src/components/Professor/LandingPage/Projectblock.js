import React from 'react';
import {Link} from 'react-router-dom'

function Projectblock(props) {

    const data = {
        tags: props.project.tags,
        desc: props.project.desc,
        title: props.project.name,
        url: "/professor/project/" + props.project._id,
        applicationURL: "/professor/applications/" + props.project._id,
        startDate: props.project.startDate,
        closeDate: props.project.applicationCloseDate,
        restricted: props.project.restrictedView,
        active: props.project.active,
        selected: props.project.selected,
        interview: props.project.interview,
        views:props.project.views
    }

    return (
        <div className="p-2 lg:w-1/2">
            <div className="h-full bg-gray-200 px-8 pt-12 pb-20 rounded-lg overflow-hidden relative">
                <div className="flex flex-row space-x-2">
                {data.tags && data.tags.map(tag => {return <h2 key={tag} className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">#{tag.toUpperCase()}</h2>})}
                </div>
                <Link className="title-font sm:text-2xl text-xl font-medium text-gray-900 hover:underline cursor-pointer" to={data.url}>{data.title}</Link>
                <div className="my-6">
                    <p className="font-medium mb-1">Start Date for Project: {new Date(data.startDate).toDateString()}</p>
                    <p className="font-medium mb-1">Application Deadline: <span className="underline">{new Date(data.closeDate).toDateString()}</span></p>
                    <p className="font-medium underline">{data.restricted ? "Restricted to " + props.college : "Shown to everyone"}</p>
                </div>

                <div className="items-end flex flex-col">
                <Link to={data.url} className="text-teal-600 inline-flex items-center text-xl hover:underline cursor-pointer" target="_blank">Project Details
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </Link>
                <Link to={data.applicationURL} className="text-teal-600 inline-flex items-center text-xl hover:underline cursor-pointer" target="_blank">Applications
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </Link>
                </div>
                <div className="text-center mt-2 leading-none flex space-x-2 justify-center absolute bottom-0 left-0 w-full py-4">
                    <span className={data.active && Number(data.active) > 0 ? "text-teal-600" : "text-gray-600" +" inline-flex items-center leading-none text-sm py-1 border-r-2 border-gray-300 pr-2"}>
                        APPLICATIONS: {data.active ? data.active : 0}
                    </span>
                    <span className="text-gray-600 inline-flex items-center leading-none text-sm py-1 border-r-2 border-gray-300 pr-2">
                        INTERVIEWING / SELECTED: {(data.selected != null && data.interview != null) ? data.selected + data.interview : 0}
                    </span>
                    <span className="text-gray-600 inline-flex items-center leading-none text-sm py-1">
                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx={12} cy={12} r={3} />
                        </svg>{data.views}
                    </span>
                 </div>
            </div>
        </div>
    )
}

export default Projectblock;