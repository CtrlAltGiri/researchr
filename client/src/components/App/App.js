import React from 'react';
import AppStudent from './AppStudent';
import AppProfessor from './AppProfessor';
import Error from './Error'
import {Switch, Route} from 'react-router-dom'

function App(props) {

    return (
        <Switch>
            <Route path="/student" component={AppStudent} />
            <Route path="/professor" component={AppProfessor} />
            <Route path="/" component={Error} />
        </Switch>
    );
}

export default App;