const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    type: { type: String, required: true, enum: ['rating', 'choice', 'open'] },
    choices: [{ type: String }], // for 'choice' type questions
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
