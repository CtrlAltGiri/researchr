import React, { useEffect, useState} from 'react';
import HeaderStudent from '../Header/HeaderStudent';
import ProjectSection from '../ProjectSection/ProjectSection';
import ProjectPage from '../ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Profile/ProfilePage/Profile';
import CreateProfile from '../Profile/CreateProfile/CreateProfile';
import Applications from '../Applications/Applications'
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { TextField } from '../General/Form/FormComponents';

function Test(){

  const [val, setval] = useState('')
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    if(val.length > 0)
      axios.get("https://autocomplete.clearbit.com/v1/companies/suggest?query=" + val).then(res => setCompanies(res.data))
    else
      setCompanies([])
  },[val])

  return(
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


function AppStudent(props) {

  useEffect(() => {
    axios.get("/plsauthenticate").then(function (response) {
      console.log("authenication done dev");
    }).catch(function (err) {
      console.log("error auth");
    })
  }, [])

  return (
    <div>

      <HeaderStudent />
      <Switch>
        <Route path="/student" component={ProjectSection} exact />
        <Route path="/student/project/:projectId" component={ProjectPage} />
        <Route path="/student/profile" component={Profile} exact/>
        <Route path="/student/applications" component={Applications} />
        <Route path="/student/profile/createProfile" component={CreateProfile} />
        <Route path="/student/test" component={Test} />
      </Switch>
    </div>
  );
}

export default AppStudent;
