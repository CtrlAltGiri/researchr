import React from 'react';

function Tabs(props){

    return(
        <div className="container py-4 mx-auto">
          <div className="flex flex-col text-center w-full">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-2 text-gray-900">{props.text}</h1>
            <div className="flex mx-auto border-2 border-teal-500 rounded overflow-hidden mt-4">

                {
                    props.data.map((tab, index) => {
                        if(index !== props.data.length - 1){
                            return <button key={tab} onClick={(e) => props.onClick(index)} className={`py-1 px-4 border-r-2 border-teal-500 focus:outline-none ${props.tab === index ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>{tab}</button>
                        }
                        else{
                            return <button key={tab} onClick={(e) => props.onClick(index)} className={`py-1 px-4 focus:outline-none ${props.tab === index ? 'bg-teal-500 text-white focus:outline-none' : ''}`}>{tab}</button>
                        }
                    })
                }

            </div>
          </div>
        </div>
    )
}

export default Tabs;