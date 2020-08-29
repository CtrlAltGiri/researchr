import React, { useState } from 'react';
import Header from '../Header/Header';
import ProjectSection from '../ProjectSection/ProjectSection';
import { Switch , Route } from 'react-router-dom';

function Cray(){
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
          <Route path ="/" component={ProjectSection} exact/>
          <Route path ="/profile" component={Cray} />
      </Switch>
    </div>
  );

}

export default App;
