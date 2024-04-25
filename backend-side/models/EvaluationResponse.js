const mongoose = require('mongoose');

const evaluationResponseSchema = new mongoose.Schema({
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    answers: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: { type: mongoose.Mixed, required: true }, // can be a number, string, or an array
    }],
    openEndedResponse: { type: String },
    ipAddress: { type: String, required: true }
});

const EvaluationResponse = mongoose.model('EvaluationResponse', evaluationResponseSchema);

module.exports = EvaluationResponse;
