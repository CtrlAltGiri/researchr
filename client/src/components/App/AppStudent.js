import React, { useEffect } from 'react';
import Header from '../Header/HeaderStudent';
import ProjectSection from '../Student/ProjectSection/ProjectSection';
import ProjectPage from '../Student/ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Student/Profile/ProfilePage/Profile';
import CreateProfile from '../Student/Profile/CreateProfile/CreateProfile';
import Applications from '../Student/Applications/Applications'
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

      <Header />
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
