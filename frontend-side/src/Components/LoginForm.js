import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';
import Header from './Header';

const LoginForm = () => {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/groups/teachers', { password });
            const teachers = response.data;
            localStorage.setItem('teachers', JSON.stringify(teachers));
            navigate('/message');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <Header />
            <div className="container h-100 d-flex justify-content-center align-items-center">
                <div className="card shadow-sm border-0 rounded">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Вхід</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-4">
                                <label htmlFor="password">Пароль</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Введіть пароль групи"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">
                                Ввійти
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
