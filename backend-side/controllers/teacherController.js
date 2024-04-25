const Teacher = require('../models/Teacher');

exports.getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find().populate('department');
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeacherSuggestions = async (req, res) => {
    const { name } = req.query;
    try {
        const teachers = await Teacher.find({ name: { $regex: name, $options: 'i' } }).select('name');
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeacherById = async (req, res) => {
    const { id } = req.params;

    try {
        const teacher = await Teacher.findById(id).populate('department');
        if (!teacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createTeacher = async (req, res) => {
    const { name, department } = req.body;
    const newTeacher = new Teacher({ name, department: department });

    try {
        const savedTeacher = await newTeacher.save();
        res.status(201).json(savedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, department } = req.body;

    try {
        const updatedTeacher = await Teacher.findByIdAndUpdate(
            id,
            { name, department: department },
            { new: true }
        ).populate('department');
        if (!updatedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json(updatedTeacher);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteTeacher = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(id);
        if (!deletedTeacher) {
            return res.status(404).json({ message: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
