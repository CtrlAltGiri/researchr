import React from 'react';
import ReactModal from 'react-modal';
import '../../Header/svg.css'

function CollegeModal(props){

    function closeModal() {
        props.setModalOpen(false);
    }

    return (<ReactModal
        isOpen={props.modalOpen}
        onRequestClose={closeModal}
    >
        <div className="flex flex-col w-full">
            <form className="flex flex-col" onSubmit={props.submitInnerForm}>

                <div className="flex flex-row justify-between">
                    <p className="mb-4 text-2xl px-1 text-gray-800 font-medium">Enter details of your university experience</p>
                    <button className="pr-4" onClick={(e) => {closeModal()}}><svg className="svg-icon" viewBox="0 0 20 20">
                    <path d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"></path>
                </svg></button>
                </div>  
                <div className="mb-8"> 
                    <p className="text-l text-gray-700 px-1 mb-1">College</p>
                    <input onChange={props.changeInput} type="text" name="college" className="p-2 w-full md:w-1/2 border-2 rounded-lg outline-none focus:border-teal-500"></input>
                </div>
                <div className="flex flex-col md:flex-row mb-8">
                    <div className="w-full md:w-1/3">
                        <p className="text-l text-gray-700 mb-1 px-1">Degree</p>
                        <input onChange={props.changeInput} type="text" name="degree" className="p-2 w-full md:w-3/4 border-2 rounded-lg outline-none focus:border-teal-500"></input>
                    </div>

                    <div className="w-full md:w-1/3">
                        <p className="text-l text-gray-700 mb-1 px-1 w-1/2">Branch</p>
                        <input onChange={props.changeInput} type="text" name="branch" className="p-2 w-full md:w-3/4 border-2 rounded-lg outline-none focus:border-teal-500"></input>
                    </div>

                    <div className="w-full md:w-1/3">
                    <p className="text-l text-gray-700 px-1 mb-1 w-1/2">Year of Graduation</p>
                        <input onChange={props.changeInput} type="text" name="yog" className="p-2 w-full md:w-3/4 border-2 rounded-lg outline-none focus:border-teal-500"></input>
                    </div>

                </div>

                <div className="mb-8">
                    <p className="text-l text-gray-700 px-1 mb-1">Experienes</p>
                    <textarea onChange={props.changeInput} className="p-2 min-w-full outline-none focus:border-teal-500 border-2 rounded-lg min-h-1/4" name="experience"/>
                </div>


                <button type="submit" className="flex mx-auto text-white mt-6 bg-teal-500 border-0 py-2 px-8 focus:outline-none hover:bg-teal-600 rounded text-lg">Add</button>
                {props.showError && <h1 className="text-red-500 text-2xl mt-4">Please complete all required fields</h1>}
            </form>
        </div>
    </ReactModal>);
}

export default CollegeModal;