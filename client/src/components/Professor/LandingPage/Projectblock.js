import React from 'react';
import {Link} from 'react-router-dom'

function Projectblock(props) {

    const data = {
        tags: props.project.tags,
        desc: props.project.desc,
        title: props.project.name,
        url: "/professor/project/" + props.project._id,
        startDate: props.project.startDate,
        closeDate: props.project.applicationCloseDate,
        restricted: props.project.restrictedView,
        college: props.project.college,
        active: props.project.active,
        selected: props.project.selected,
        interview: props.project.interview,
        views:props.project.views
    }

    return (
        <div className="p-4 lg:w-1/2">
            <div className="h-full bg-gray-200 px-8 pt-16 pb-20 rounded-lg overflow-hidden relative">
                <h2 className="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">PROJECT TAGS</h2>
                <Link className="title-font sm:text-2xl text-xl font-medium text-gray-900 hover:underline cursor-pointer" to={data.url}>{data.title}</Link>
                {/*<p className="leading-relaxed my-3">Project Description is a major boost in terms of how much we need to grow and scale based on that. It is ultimately the role of the professor to do the same.</p>
                */}
                <div className="my-6">
                    <p className="font-medium mb-1">Start Date for Project: {new Date(data.startDate).toDateString()}</p>
                    <p className="font-medium mb-1">Application Deadline: <span className="underline">{new Date(data.closeDate).toDateString()}</span></p>
                    <p className="font-medium underline">Restricted to IIT Bombay</p>
                </div>

                <div className="text-right">
                <Link to={data.url} className="text-teal-600 inline-flex items-center text-xl hover:underline cursor-pointer">Project Details
                    <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5l7 7-7 7" />
                    </svg>
                </Link>
                </div>
                <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                    <span className="text-gray-600 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-300">
                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx={12} cy={12} r={3} />
                        </svg>{data.views}
                    </span>
                    <span className="text-gray-600 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-300">
                        <svg className="w-4 h-4 mr-1" stroke="salmon" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>{data.active ? data.active : 0}
                    </span>
                    <span className="text-gray-600 mr-3 inline-flex items-center leading-none text-sm pr-3 py-1 border-r-2 border-gray-300">
                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>{data.interview ? data.interview : 0}
                    </span>
                    <span className="text-gray-600 inline-flex items-center leading-none text-sm pr-3 py-1">
                        <svg className="w-4 h-4 mr-1" stroke="lightseagreen" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                        </svg>{data.selected ? data.selected : 0}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Projectblock;