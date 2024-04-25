import api from './api';
const login = (email, password) => {
    console.log(email, password)
    return api
        .post("/auth/admin", {
            email,
            password,
        })
        .then((response) => {
            console.log(response)
            if (response.data.email) {

                localStorage.setItem("user", JSON.stringify(response.data));
            }

            return response.data;
        });
};

const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post("/admin/logout").then((response) => {
        return response.data;
    });
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const authService = {
    login,
    logout,
    getCurrentUser
};

export default authService;
