import api from './api';

const loginStudent = async ({ groupId, password }) => {
    try {
        const response = await api.post('/auth/student', { groupId, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        // Set the token in the request headers for future requests
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } catch (error) {
        throw error.response.data;
    }
};

const logoutStudent = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
};

const authService = {
    loginStudent,
    logoutStudent,
};

export default authService;
