import React, { useState, useEffect } from 'react';
import HeaderStudent from '../Header/HeaderStudent';
import ProjectSection from '../ProjectSection/ProjectSection';
import ProjectPage from '../ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Profile/Profile';
import CreateProfile from '../Profile/CreateProfile/CreateProfile';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { TealButton } from '../General/Form/FormComponents';

function Cray() {
    return <h1>Done</h1>
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
        <Route path="/student/profile" component={Profile} />
        <Route path="/student/applications" component={Cray} />
        <Route path="/student/messages" component={Cray} />
        <Route path="/student/profile/createProfile" component={CreateProfile} />
      </Switch>
    </div>
  );
}

export default AppStudent;
