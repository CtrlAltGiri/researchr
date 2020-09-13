import React, { useEffect } from 'react';
import HeaderStudent from '../Header/HeaderStudent';
import ProjectSection from '../ProjectSection/ProjectSection';
import ProjectPage from '../ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Profile/ProfilePage/Profile';
import CreateProfile from '../Profile/CreateProfile/CreateProfile';
import Applications from '../Applications/Applications'
import Error from './Error';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Test from '../General/Form/CompanyInput';

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
        <Route path="/student/profile/createProfile" component={CreateProfile} />
        <Route path="/student/profile" component={Profile} exact />
        <Route path="/student/applications" component={Applications} />
        <Route path="/student/test" component={Test} />
        <Route path="/" component={Error} />
      </Switch>
    </div>
  );
}

export default AppStudent;
