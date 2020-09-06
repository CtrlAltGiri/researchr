import React from 'react';

function Experience(props) {
    return (
      <div className="xl:w-1/4 md:w-1/2 p-4">
        <div className="bg-white p-6 rounded-lg">
          <img className="h-56 min-w-40 md:h-40 rounded w-full object-cover object-center mb-6" src={"//logo.clearbit.com/" + props.url + "?size=400"} alt="content" />
          <h3 className="tracking-widest text-teal-500 text-xs font-medium title-font">{props.title.toUpperCase()}</h3>
          <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{props.name}</h2>
          <p className="leading-relaxed text-base">{props.description}</p>
        </div>
      </div>
    );
}

export default Experience;

