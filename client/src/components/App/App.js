import React, { useState } from 'react';
import Header from '../Header/Header';
import ProjectSection from '../ProjectSection/ProjectSection';
import Profile from '../Profile/Profile';
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
        <Route path="/platform/profile" component={Profile} />
        <Route path="/platform/applications" component={Cray} />
        <Route path="/platform/faq" component={Cray} />
      </Switch>
    </div>
  );
}

export default App;
