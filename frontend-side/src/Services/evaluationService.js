import api from './api';

const submitEvaluation = async (evaluationData) => {
    return await api.post('/evaluations', evaluationData);
};

const getEvaluationResults = async (teacherId) => {
    return await api.get(`/evaluations/${teacherId}`);
};

const getTeacherSuggestions = async (searchTerm) => {
    return await api.get(`/teachers/suggestions?name=${searchTerm}`);
};

const getAllEvaluationResults = async () => {
    return await api.get('/evaluations');
};
const generateEvaluationPDF = async (teacherId) => {
    return await api.get(`/evaluations/pdf/${teacherId}`, {
        responseType: 'arraybuffer',
    });
};

const getEvaluationStats = async () => {
    return await api.get('/evaluations/stats');
};

const getEvaluationStatus = async (teacherId) => {
    try {
        const response = await api.get(`/evaluations/status/${teacherId}`);
        return response.data;
    } catch (error) {
        throw new Error('Error checking evaluation status');
    }
};

const evaluationService = {
    submitEvaluation,
    getEvaluationResults,
    generateEvaluationPDF,
    getEvaluationStats,
    getAllEvaluationResults,
    getTeacherSuggestions,
    getEvaluationStatus
};

export default evaluationService;
