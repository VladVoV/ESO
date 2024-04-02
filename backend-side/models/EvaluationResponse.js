const mongoose = require('mongoose');

const evaluationResponseSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    answers: [{
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
        answer: { type: mongoose.Mixed, required: true }, // can be a number, string, or an array
    }],
    openEndedResponse: { type: String },
});

const EvaluationResponse = mongoose.model('EvaluationResponse', evaluationResponseSchema);

module.exports = EvaluationResponse;
