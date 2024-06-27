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
            <h2 className="display-4">Дякую за вашу участь!</h2>
            <p className="lead">Ваша відповідь була успішно відправлена.</p>
            <button className="btn btn-primary btn-block" onClick={handleReturn}>Повернутися на головну сторінку</button>
        </div>
        </div>
    );
};

export default SubmissionConfirmation;
