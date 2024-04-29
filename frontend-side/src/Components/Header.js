import React, { useState, useEffect } from "react";
import '../index.css'
import {Link} from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import authService from "../Services/authService";



function Navbar() {
    const [currentUser, setCurrentUser] = useState(undefined);
    const navigate = useNavigate();

        useEffect(() => {
            const user = authService.getCurrentUser();
            if (user) {
                setCurrentUser(user);
            }
            }, [])

    const logOut = () => {
        authService.logout();
    };

    const handleReturnToMainPage = () => {
        navigate('/');
    };


    return (
        <header className="navbar navbar-expand-lg navbar-light bg-light">
            <h1 className="navbar-brand" onClick={handleReturnToMainPage}>PNU</h1>

            <nav className="navbar-nav ml-auto">
                <ul className="navbar-nav">
                    {currentUser && (
                        <li className="nav-item">
                            <Link className="nav-link" to={'/admin/departments'}>
                                <div>Departments</div>
                            </Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className="nav-item">
                            <Link className="nav-link" to={'/admin/teachers'}>
                                <div>Teachers</div>
                            </Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className="nav-item">
                            <Link className="nav-link" to={'/admin/groups'}>
                                <div>Groups</div>
                            </Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className="nav-item">
                            <Link className="nav-link" to={'/admin/questions'}>
                                <div>Questions</div>
                            </Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className="nav-item">
                            <Link className="nav-link" to={'/admin/evaluation-statistics'}>
                                <div>Statistics</div>
                            </Link>
                        </li>
                    )}
                    {currentUser && (
                        <li className="nav-item">
                            <a href="/" className="nav-link" onClick={logOut}>
                                LogOut
                            </a>
                        </li>
                    )}
                </ul>
            </nav>

        </header>
    );
}

export default Navbar;
