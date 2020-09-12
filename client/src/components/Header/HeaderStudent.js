import React from 'react';
import './svg.css';
import {Link} from 'react-router-dom';

function Header() {
    return (
        <header className="md:px-16 px-6 bg-white flex flex-wrap items-center py-8 md:py-4">
            <div className="flex-1 flex justify-between items-center">
                <Link to="/student" className="px-8">
                    <svg viewBox="0 0 20 20" className="svg-icon"><path fill="none" d="M16.853,8.355V5.888c0-3.015-2.467-5.482-5.482-5.482H8.629c-3.015,0-5.482,2.467-5.482,5.482v2.467l-2.741,7.127c0,1.371,4.295,4.112,9.594,4.112s9.594-2.741,9.594-4.112L16.853,8.355z M5.888,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C6.402,17.137,6.173,17.367,5.888,17.367z M5.203,10c0-0.377,0.19-0.928,0.423-1.225c0,0,0.651-0.831,1.976-0.831c0.672,0,1.141,0.309,1.141,0.309C9.057,8.46,9.315,8.938,9.315,9.315v1.028c0,0.188-0.308,0.343-0.685,0.343H5.888C5.511,10.685,5.203,10.377,5.203,10z M7.944,16.853H7.259v-1.371l0.685-0.685V16.853z M9.657,16.853H8.629v-2.741h1.028V16.853zM8.972,13.426v-1.028c0-0.568,0.46-1.028,1.028-1.028c0.568,0,1.028,0.46,1.028,1.028v1.028H8.972z M11.371,16.853h-1.028v-2.741h1.028V16.853z M12.741,16.853h-0.685v-2.056l0.685,0.685V16.853z M14.112,17.367c-0.284,0-0.514-0.23-0.514-0.514c0-0.284,0.23-0.514,0.514-0.514c0.284,0,0.514,0.23,0.514,0.514C14.626,17.137,14.396,17.367,14.112,17.367z M14.112,10.685h-2.741c-0.377,0-0.685-0.154-0.685-0.343V9.315c0-0.377,0.258-0.855,0.572-1.062c0,0,0.469-0.309,1.141-0.309c1.325,0,1.976,0.831,1.976,0.831c0.232,0.297,0.423,0.848,0.423,1.225S14.489,10.685,14.112,10.685z M18.347,15.801c-0.041,0.016-0.083,0.023-0.124,0.023c-0.137,0-0.267-0.083-0.319-0.218l-2.492-6.401c-0.659-1.647-1.474-2.289-2.905-2.289c-0.95,0-1.746,0.589-1.754,0.595c-0.422,0.317-1.084,0.316-1.507,0C9.239,7.505,8.435,6.916,7.492,6.916c-1.431,0-2.246,0.642-2.906,2.292l-2.491,6.398c-0.069,0.176-0.268,0.264-0.443,0.195c-0.176-0.068-0.264-0.267-0.195-0.444l2.492-6.401c0.765-1.911,1.824-2.726,3.543-2.726c1.176,0,2.125,0.702,2.165,0.731c0.179,0.135,0.506,0.135,0.685,0c0.04-0.029,0.99-0.731,2.165-0.731c1.719,0,2.779,0.814,3.542,2.723l2.493,6.404C18.611,15.534,18.524,15.733,18.347,15.801z"></path></svg>
                </Link>
            </div>
            <input className="hidden" type="checkbox" id="menu-toggle" />
            <div className="hidden md:flex md:items-center md:w-auto w-full" id="menu">
                <nav>
                    <ul className="md:flex items-center justify-between text-base text-gray-700 pt-2 md:pt-0 text-center md:text-left">
                        <li><Link to="/student/profile" className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-teal-500">My Profile</Link></li>
                        <li><Link to="/student/applications" className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-teal-500">Applications</Link></li>
                        <li><a className="md:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-red-500 md:mb-0 mb-2 text-red-500" href="/logout">Sign out</a></li>
                    </ul>
                </nav>
            </div>
            <a href="#" id="profileImage" className="md:ml-4 flex items-center justify-start md:mb-0 mb-4 m-auto md:m-0 cursor-pointer">
                <label htmlFor="menu-toggle" className="cursor-pointer md:hidden block">
                    <img className="rounded-full w-10 h-10 border-2 border-transparent hover:border-teal-500" src="/images/defaultProfile.png" alt="Giridhar" />
                </label>
                <img className="rounded-full w-10 h-10 border-2 border-transparent hover:border-teal-500 hidden md:inline" src="/images/defaultProfile.png" alt="Giridhar" />
            </a>
        </header>

    );
}

export default Header;