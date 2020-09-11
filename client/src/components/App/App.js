import React from 'react';
import AppStudent from './AppStudent'
import {Switch, Route} from 'react-router-dom'

function App(props) {

    return (
        <Switch>
            <Route path="/student" component={AppStudent} />
            <Route path="/professor" component={AppStudent} />
            <Route path="/default" component={AppStudent} />
        </Switch>
    );
}

export default App;