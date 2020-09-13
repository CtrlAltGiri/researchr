import React, {useState, useEffect} from 'react';
import { TextField } from './FormComponents';
import axios from 'axios';

function Test() {

    const [val, setval] = useState('')
    const [companies, setCompanies] = useState([])
  
    useEffect(() => {
      if (val.length > 0)
        axios.get("https://autocomplete.clearbit.com/v1/companies/suggest?query=" + val).then(res => setCompanies(res.data))
      else
        setCompanies([])
    }, [val])
  
    return (
      <div>
        <TextField
          text="Company"
          onChange={e => setval(e.target.value)}
          value={val}
          extraClass="w-full flex-col flex items-center mb-4"
          fieldExtraClass=""
        />
        <div className="flex flex-row flex-wrap justify-center">
          {companies && companies.map(company => {
            return <p className="bg-teal-300 rounded-lg py-2 px-2 mx-4 mb-2 font-medium text-lg">{company.name}</p>
          })}
        </div>
  
      </div>
    );
  }

export default Test;