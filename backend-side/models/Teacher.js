const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
});

const Teacher = mongoose.model('Teacher', teacherSchema);

module.exports = Teacher;
