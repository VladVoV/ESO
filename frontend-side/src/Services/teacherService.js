import api from './api';

const getAllTeachers = async () => {
    return await api.get('/teachers');
};

const createTeacher = async (teacher) => {
    console.log(teacher)
    return await api.post('/teachers', teacher);
};

const getTeacherById = async (teacherId) => {
    const response = await api.get(`/teachers/${teacherId}`);
    return response.data;
};

const updateTeacher = async (id, updatedTeacher) => {
    return await api.put(`/teachers/${id}`, updatedTeacher);
};

const deleteTeacher = async (id) => {
    return await api.delete(`/teachers/${id}`);
};

const teacherService = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
};

export default teacherService;
