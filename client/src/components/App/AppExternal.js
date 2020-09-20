import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import StudentProfile from '../Student/Profile/ProfilePage/Profile';
import ProfessorProfile from '../Professor/ProfilePage/ProfilePage';

function PleaseSignUp(){
    return <h1>Create your account in ResearchR now!</h1>
}

function AppExternal(props) {

    return (
        <div>
            <Switch>
                <Route path="/external/student/profile/:studentID" component={() => <StudentProfile apiURL="/api/public/student/"/>} />
                <Route path="/external/professor/profile/:profileID" component={() => <ProfessorProfile apiURL="/api/public/professor/"/>} />
                <Route path="/external" component={PleaseSignUp} />
            </Switch>
        </div>
    );
}

export default AppExternal;