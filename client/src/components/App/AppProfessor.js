import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from '../Header/HeaderStudent'

function ItBegins() {
    return <h1>Let the shit show begin</h1>
}

function AppProfessor(props) {
    return (
        <div>
            <Header />
            <Switch>
                <Route path="/professor" component={ItBegins} exact />
            </Switch>
        </div>
    );
}

export default AppProfessor;