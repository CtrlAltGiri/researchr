import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { CloseButton, Title, Label } from '../../../General/Form/FormComponents';
import { colleges } from '../../../../common/data/collegeData';

function ModalElement(props) {
  return (
    <div className="mb-4">
          <Label text={props.label} />
          <p className="px-1">{props.description}</p>
        </div>
  )
}

function Experience(props) {
  
  let description, imageURL;
  const defaultURL = '/images/defaultCompany.jfif';
  let domain = props.logoURL;
  if(domain === 'e'){
    domain = colleges.find(college => college.value === props.name); 
    if(domain){
      domain = domain.url;
    }
  }
  imageURL = domain ? "//logo.clearbit.com/" + domain + "?size=400" : defaultURL;

  const [modalOpen, setModalOpen] = useState(false);

  if (props.description) {
    description = props.description.substr(0, 100);
    if (props.description.length > 100) {
      description += '...';
    }
  }

  return (
    <div className="xl:w-1/4 md:w-1/2 p-4">
      <div className="bg-white p-6 rounded-lg">
        <img onClick={(e) => setModalOpen(true)} onError={(e)=>e.target.setAttribute("src",defaultURL)} className="h-56 md:h-40 w-full rounded object-cover object-center mb-6 cursor-pointer" src={imageURL} alt="content" />
        <h3 className="tracking-widest text-teal-500 text-xs font-medium title-font">{!!props.title ? props.title.toUpperCase() : props.research.toUpperCase()}</h3>
        <h2 className="text-lg text-gray-900 font-medium title-font mb-4">{props.name}</h2>
        <p className="leading-relaxed text-base">{description}</p>
      </div>

      <ReactModal
        isOpen={modalOpen}
        onRequestClose={(e) => setModalOpen(false)}
      >

        <div className="flex justify-between mb-8">
          <Title text={props.name} />
          <CloseButton onClick={(e) => setModalOpen(false)} />
        </div>

        <div className="flex flex-row justify-center">
          <img onClick={(e) => setModalOpen(true)} onError={(e)=>e.target.setAttribute("src",defaultURL)} className="w-32 rounded object-cover object-center mb-6 cursor-pointer" src={imageURL} alt="content" />
        </div>

        {props.displayParams.map((disp, index) => {
          return <ModalElement
                    label={props.displayModal[index]}
                    key={props.displayModal[index]}
                    description={props.experience[disp]}
                  />
        })}

      </ReactModal>

    </div>
  );
}

export default Experience;

