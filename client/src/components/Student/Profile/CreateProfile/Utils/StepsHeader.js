import React from 'react';

function StepsHeader(props) {

    const finishPrevSteps = "Finish Previous Steps"
    return (
        <div className="flex mx-auto flex-wrap mb-12">
            <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${props.step === 1 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                onClick={(e) => { props.setStep(1) }}>
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>STEP 1
                    </a>
            <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${props.step === 2 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                onClick={(e) => { if (props.completedStep >= 1) props.setStep(2); else props.setShowError(finishPrevSteps) }}>
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>STEP 2
                    </a>
            <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${props.step === 3 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                onClick={(e) => { if (props.completedStep >= 2) props.setStep(3); else props.setShowError(finishPrevSteps) }}>
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <circle cx={12} cy={5} r={3} />
                    <path d="M12 22V8M5 12H2a10 10 0 0020 0h-3" />
                </svg>STEP 3
                    </a>
            <a className={`sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-medium inline-flex items-center leading-none border-gray-200 hover:text-gray-900 tracking-wider cursor-pointer ${props.step === 4 ? "rounded-t bg-gray-100 border-teal-500 text-teal-500}" : ""}`}
                onClick={(e) => { if (props.completedStep >= 3) props.setStep(4); else props.setShowError(finishPrevSteps) }}>
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx={12} cy={7} r={4} />
                </svg>STEP 4
                    </a>
        </div>
    );
}

export default StepsHeader;