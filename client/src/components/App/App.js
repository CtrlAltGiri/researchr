import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import ProjectSection from '../ProjectSection/ProjectSection';
import ProjectPage from '../ProjectSection/ProjectPage/ProjectPage';
import Profile from '../Profile/Profile';
import CreateProfile from '../Profile/CreateProfile/CreateProfile';
import { Switch, Route } from 'react-router-dom';
import axios from 'axios';
import { TealButton } from '../General/Form/FormComponents';

function Cray() {

  const [file, setFile] = useState();

  function onFilesAdded(event) {
    setFile(event.target.files[0])
  }

  function onSubmit(event) {
    event.preventDefault();
    if(file){
      const url = "/api/testUpload";
      const formData = new FormData();
      formData.append('file',file)
      const config = {
          headers: {
              'Access-Control-Allow-Origin': '*',
              'content-type': 'multipart/form-data'
          }
      }
      axios.post(url, formData, config).then(function(res){
        console.log(res);
      }).catch(function(err){
        console.log(err)
      })
    }
  }

  function brr(event){
    axios.get('/api/testUpload').then((res) => {
      console.log(res);
    }).catch((err) => console.log(err));
  }

  return (
    <div>
    <form onSubmit={onSubmit}>
      <input type="file" onChange={onFilesAdded} />
      <TealButton type="submit" text="Submit" />
    </form>
     <a target="_blank" href="/api/testUpload"> GET </a>
     </div>
  )
}

function App(props) {

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
