import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./Header";

const SubmissionConfirmation = () => {
    const navigate = useNavigate();

    const handleReturn = () => {
        navigate('/');
    };

    return (
        <div>
            <Header/>
        <div className="container mt-5 text-center">
            <h2 className="display-4">Thank you for your submission!</h2>
            <p className="lead">Your evaluation has been successfully submitted.</p>
            <button className="btn btn-primary btn-block" onClick={handleReturn}>Return to the main page</button>
        </div>
        </div>
    );
};

export default SubmissionConfirmation;
