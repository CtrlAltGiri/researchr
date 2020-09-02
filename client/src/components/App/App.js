import React, { useState } from 'react';
import Header from '../Header/Header';
import ProjectSection from '../ProjectSection/ProjectSection';
import ProjectPage from '../ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Profile/Profile';
import CreateProfile from '../Profile/CreateProfile/CreateProfile';
import { Switch, Route } from 'react-router-dom';

function Cray() {
  return (
    <h1>
      Giridhar
    </h1>
  )
}

function App(props) {
  return (
    <div>
      <Header />
      <Switch>
        <Route path="/platform" component={ProjectSection} exact />
        <Route path="/platform/project/:projectId" component={ProjectPage} />
        <Route path="/platform/profile" component={Profile} />
        <Route path="/platform/applications" component={Cray} />
        <Route path="/platform/messages" component={Cray} />
        <Route path="/platform/createProfile" component={CreateProfile} />
      </Switch>
    </div>
  );
}

export default App;
