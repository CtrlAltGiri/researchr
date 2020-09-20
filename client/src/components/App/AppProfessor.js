import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../Header/HeaderProfessor'
import LandingPage from '../Professor/LandingPage/LandingPage';
import ProjectPage from '../Professor/ProjectPage/ProjectPage';
import ProfilePage from '../Professor/ProfilePage/ProfilePage';
import axios from 'axios';

function ItBegins() {
    return <h1>Let the shit show begin</h1>
}

function AppProfessor(props) {

    useEffect(() => {
        axios.get("/plsauthenticate/Professor").then(function (response) {
          console.log("authenication done dev");
        }).catch(function (err) {
          console.log("error auth");
        })
      }, [])

    return (
        <div>
            <Header />
            <Switch>
                <Route path="/professor" component={LandingPage} exact />
                <Route path="/professor/project/:projectID" component={ProjectPage} />
                <Route path="/professor/profile/:profileID" component={ProfilePage} />
            </Switch>
        </div>
    );
}

export default AppProfessor;