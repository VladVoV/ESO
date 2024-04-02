import api from './api';

const submitEvaluation = async (evaluationData) => {
    return await api.post('/evaluations', evaluationData);
};

const getEvaluationResults = async (teacherId) => {
    return await api.get(`/evaluations/${teacherId}`);
};

const generateEvaluationPDF = async (teacherId) => {
    return await api.get(`/evaluations/pdf/${teacherId}`, {
        responseType: 'arraybuffer',
    });
};

const getEvaluationStats = async () => {
    return await api.get('/evaluations/stats');
};

const evaluationService = {
    submitEvaluation,
    getEvaluationResults,
    generateEvaluationPDF,
    getEvaluationStats,
};

export default evaluationService;
