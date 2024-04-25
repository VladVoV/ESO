import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../Services/authService';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const currentUser = authService.getCurrentUser();
    const location = useLocation();

    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;
