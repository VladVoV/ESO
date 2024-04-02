import api from './api';

const getAllQuestions = async () => {
    return await api.get('/questions');
};

const createQuestion = async (question) => {
    return await api.post('/questions', question);
};

const updateQuestion = async (id, updatedQuestion) => {
    return await api.put(`/questions/${id}`, updatedQuestion);
};

const deleteQuestion = async (id) => {
    return await api.delete(`/questions/${id}`);
};

const questionService = {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
};

export default questionService;
