// import React, { createContext, useContext, useState, useEffect } from 'react';
// import authService from '../Services/authService';
//
// const AuthContext = createContext();
//
// export const useAuth = () => useContext(AuthContext);
//
// const AuthProvider = ({ children }) => {
//     const [isAuthenticated, setIsAuthenticated] = useState(false);
//     const [userRole, setUserRole] = useState(null);
//
//     useEffect(() => {
//         const token = localStorage.getItem('token');
//         if (token) {
//             // Validate the token and set authentication state
//             const decodedToken = authService.decodeToken(token);
//             if (decodedToken) {
//                 setIsAuthenticated(true);
//                 setUserRole(decodedToken.role);
//             }
//         }
//     }, []);
//
//     const login = async (credentials, role) => {
//         try {
//             const { token } = await authService.login(credentials);
//             localStorage.setItem('token', token);
//             setIsAuthenticated(true);
//             setUserRole(role);
//         } catch (error) {
//             console.error('Error logging in:', error);
//         }
//     };
//
//     const logout = () => {
//         localStorage.removeItem('token');
//         setIsAuthenticated(false);
//         setUserRole(null);
//     };
//
//     const authContextValue = {
//         isAuthenticated,
//         userRole,
//         login,
//         logout,
//     };
//
//     return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
// };
//
// export default AuthProvider;
