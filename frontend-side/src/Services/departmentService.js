import api from './api';

const getAllDepartments = async () => {
    return await api.get('/departments');
};

const createDepartment = async (name) => {
    return await api.post('/departments', { name });
};

const updateDepartment = async (id, name) => {
    return await api.put(`/departments/${id}`, { name });
};

const deleteDepartment = async (id) => {
    return await api.delete(`/departments/${id}`);
};

const departmentService = {
    getAllDepartments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
};

export default departmentService;
