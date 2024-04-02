import api from './api';

const getAllGroups = async () => {
    return await api.get('/groups');
};

const createGroup = async (group) => {
    return await api.post('/groups', group);
};

const updateGroup = async (id, updatedGroup) => {
    return await api.put(`/groups/${id}`, updatedGroup);
};

const deleteGroup = async (id) => {
    return await api.delete(`/groups/${id}`);
};

const assignTeachersToGroup = async (groupId, teacherIds) => {
    return await api.post(`/groups/${groupId}/teachers`, { teacherIds });
};

const groupService = {
    getAllGroups,
    createGroup,
    updateGroup,
    deleteGroup,
    assignTeachersToGroup,
};

export default groupService;
