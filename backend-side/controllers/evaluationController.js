const EvaluationResponse = require('../models/EvaluationResponse');
const Group = require('../models/Group');
const pdfService = require('../services/pdfService');
const statsService = require('../services/statsService');

exports.submitEvaluation = async (req, res) => {
    const { teacherId, groupId, answers, openEndedResponse } = req.body;
    const userId = req.user.groupId;

    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const newEvaluationResponse = new EvaluationResponse({
            student: userId,
            teacher: teacherId,
            group: groupId,
            answers,
            openEndedResponse,
        });

        const savedEvaluationResponse = await newEvaluationResponse.save();
        res.status(201).json(savedEvaluationResponse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getEvaluationResults = async (req, res) => {
    const { teacherId } = req.params;

    try {
        const evaluationResponses = await EvaluationResponse.find({ teacher: teacherId }).populate(
            'answers.question'
        );
        res.json(evaluationResponses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.generateEvaluationPDF = async (req, res) => {
    const { teacherId } = req.params;

    try {
        const evaluationResponses = await EvaluationResponse.find({ teacher: teacherId }).populate(
            'answers.question'
        );
        const pdfBuffer = await pdfService.generateEvaluationPDF(evaluationResponses);
        res.set('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getEvaluationStats = async (req, res) => {
    try {
        const stats = await statsService.getEvaluationStats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
