import React from 'react';
import AppStudent from './AppStudent';
import AppProfessor from './AppProfessor';
import AppExternal from './AppExternal';
import Error from './Error'
import {Switch, Route} from 'react-router-dom';
import CompanyInput from '../General/Form/CompanyInput';

function App(props) {

    return (
        <Switch>
            <Route path="/student" component={AppStudent} />
            <Route path="/professor" component={AppProfessor} />
            <Route path="/external" component={AppExternal} />
            <Route path="/" component={CompanyInput} />
        </Switch>
    );
}

export default App;