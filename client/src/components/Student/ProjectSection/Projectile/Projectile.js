import React from 'react';
import { Link } from 'react-router-dom';

function Projectile(props) {

  let desc;
  if (props.allItems.desc.length > 300){
    desc = props.allItems.desc.substr(0, 300) + "...";
  }
  else{
    desc = props.allItems.desc;
  }

    return (
      <div className="px-4 py-12 md:p-12 md:w-6/12 flex flex-col items-start">
        <div className="flex flex-row flex-wrap">
          {props.allItems.tags && props.allItems.tags.map(cat => {
            return (<span className="mr-4 py-1 px-3 mb-2 md:mb-0 rounded bg-teal-100 text-teal-500 text-sm font-medium tracking-widest">#{cat}</span>);
          })}
        </div>
        <Link to={`/student/project/${props.allItems._id}`} target="_blank  "><h2 className="sm:text-3xl text-2xl title-font font-medium text-gray-900 mt-4 mb-4 hover:underline">{props.allItems.name}</h2></Link>
        <p className="leading-relaxed mb-8">{desc}</p>
        <div className="flex items-center flex-wrap pb-4 mb-4 border-b-2 border-gray-200 mt-auto w-full">
          <Link to={`/student/project/${props.allItems._id}`} className="text-teal-500 inline-flex items-center" target="_blank">Details
                  <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </Link>
          <span className="text-gray-600 inline-flex items-center ml-auto leading-none text-sm pr-3 py-1">
            <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx={12} cy={12} r={3} />
            </svg>{props.allItems.views}
          </span>
        </div>
        <a className="inline-flex items-center">
          <img alt="blog" src="/images/defaultProfile.png" className="w-12 h-12 rounded-full flex-shrink-0 object-cover object-center" />
          <span className="flex-grow flex flex-col pl-4">
            <Link className="title-font font-medium text-gray-900 hover:underline" target="_blank" to={"/professor/profile/" + props.allItems.professorID}>{props.allItems.professorName}</Link>
            <span className="text-gray-500 text-sm">{props.allItems.college}</span>
          </span>
        </a>
      </div>
    );
}

export default Projectile;