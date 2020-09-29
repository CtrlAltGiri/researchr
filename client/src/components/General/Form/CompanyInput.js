import React, { useState, useEffect } from 'react';
import { TextField } from './FormComponents';
import axios from 'axios';

function CompanyInput(props) {

  const [companies, setCompanies] = useState([])
  const [callAPI, setCallAPI] = useState(false);

  useEffect(() => {
    if (props.value && props.value.length > 0 && setCallAPI)
      axios.get("https://autocomplete.clearbit.com/v1/companies/suggest?query=" + props.value).then(res => setCompanies(res.data))
    else
      setCompanies([])
  }, [props.value])

  function addCompany(company){
    // name, domain and logo are returned.
    // we just need domain and name.
    let finalObj = {
      [props.name]: company.name,
      [props.logoName]: company.domain
    }

    props.onSelect(undefined, finalObj);
    setCallAPI(false)
  }

  return (
    <div>
      <TextField
        text="Company"
        onChange={e => {props.onChange(e.target.value, props.name); setCallAPI(true)}}
        value={props.value}
        extraClass="w-full mb-4"
        fieldExtraClass="w-3/4 md:w-3/5"
      />
      <div className="flex flex-row flex-wrap justify-center">
        {callAPI && companies && companies.map(company => {
          return (<div className="py-1 px-4 bg-teal-300 font-medium text-teal-800 rounded-md mx-4 my-2" key={company.name}>
            <a className="cursor-pointer" onClick={(e) => { addCompany(company) }}>
              {company.name}
            </a>
          </div>
          )})}
      </div>

    </div>
  );
}

export default CompanyInput;