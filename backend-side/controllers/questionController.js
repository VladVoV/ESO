const Question = require('../models/Question');

exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createQuestion = async (req, res) => {
    const { text, type, choices } = req.body;
    const newQuestion = new Question({ text, type, choices });

    try {
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { text, type, choices } = req.body;

    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            { text, type, choices },
            { new: true }
        );
        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteQuestion = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedQuestion = await Question.findByIdAndDelete(id);
        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
