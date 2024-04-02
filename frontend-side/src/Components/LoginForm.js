import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../Services/authService';

const LoginForm = () => {
    const [groupId, setGroupId] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.loginStudent({ groupId, password });
            navigate('/evaluate');
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    return (
        <div>
            <h2>Student Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Group ID"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;
