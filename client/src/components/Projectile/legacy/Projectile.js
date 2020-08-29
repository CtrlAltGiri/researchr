import React from 'react';

function Projectile(props) {

    return (
        <div className="container px-5 py-24 mx-auto">
            <div className="-my-8">
                <div className="py-8 flex flex-wrap md:flex-no-wrap">
                    <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
                        <span className="tracking-widest font-medium title-font text-gray-900">CATEGORY</span>
                        <span className="mt-1 text-gray-500 text-sm">23rd August 2020</span>
                    </div>
                    <div className="md:flex-grow">
                        <h2 className="text-2xl font-medium text-gray-900 title-font mb-2">{props.allItems.name}'s project</h2>
                        <p className="leading-relaxed">You have to do some crazy machine learning and data science stuff. I can't explain how complex it is, but if you can do it, you're a madness.</p>
                        <a className="text-teal-500 inline-flex items-center mt-4">Learn More
                                <svg className="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14" />
                                    <path d="M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>  
            </div>
        </div>
    );
}

export default Projectile;