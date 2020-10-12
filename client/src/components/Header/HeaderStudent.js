import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import { ResearchRLogo } from '../General/Form/Buttons';
 
function Header() {

    const [studentID, setStudentID] = useState('');

    useEffect(() => {
        axios.get('/api/student/profile/getStudentId')
        .then(res => setStudentID(res.data))
        .catch(err => console.log(err));    // think this is fine.
    }, [])

    return (
        <header className="md:px-16 px-6 bg-white flex flex-wrap items-center py-8 md:py-4">
            <div className="flex-1 flex justify-between items-center">
                <ResearchRLogo url='/student' />
            </div>
            <input className="hidden" type="checkbox" id="menu-toggle" />
            <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul className="md:flex items-center justify-between text-base text-gray-700 pt-2 md:pt-0 text-center md:text-left">
                        <li><Link to={"/student/profile/" + studentID} className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-teal-500">My Profile</Link></li>
                        <li><Link to="/student/applications" className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-teal-500">Applications</Link></li>
                        <li><a className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-500 md:mb-0 mb-2 text-red-500" href="/logout">Sign out</a></li>
                    </ul>
                </nav>
            </div>
            <a href="#" id="profileImage" className="md:ml-4 flex items-center justify-start md:mb-0 mb-4 m-auto md:m-0 cursor-pointer mr-6 md:mr-0">
                <label htmlFor="menu-toggle" className="cursor-pointer md:hidden block">
                    <img className="rounded-full w-10 h-10 border-2 border-transparent hover:border-teal-500" src="/images/defaultProfile.png" alt="Profile Image" />
                </label>
                <img className="rounded-full w-10 h-10 border-2 border-transparent hover:border-teal-500 hidden md:inline" src="/images/defaultProfile.png" alt="Profile Image" />
            </a>
        </header>

    );
}

export default Header;