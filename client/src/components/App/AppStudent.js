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
import ApplicationDetails from '../Student/Applications/ApplicationDetails/ApplicationDetails';
import ChangePassword from '../General/ChangePassword/ChangePassword';
import Faq from '../Student/FAQ/Faq';

function AppStudent(props) {

  useEffect(() => {
    axios.get("/plsauthenticate/Student").then(function (response) {
      console.log("authenication done dev");
    }).catch(function (err) {
      console.log("error auth");
    })
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      <Switch>
        <Route path="/student" component={ProjectSection} exact />
        <Route path="/student/project/:projectId" component={ProjectPage} />
        <Route path="/student/profile/createProfile" component={CreateProfile} exact/>
        <Route path="/student/profile/changePassword" component={ChangePassword} exact />
        <Route path="/student/profile/:studentID" component={Profile} />
        <Route path="/student/applications" component={Applications} />
        <Route path="/student/test" component={Test} />
        <Route path="/student/application/:projectId" component={ApplicationDetails} />
        <Route path="/student/faq" component={Faq} />
        <Route path="/" component={Error} />
      </Switch>
    </div>
  );
}

export default AppStudent;
