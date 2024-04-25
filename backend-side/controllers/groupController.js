const Group = require('../models/Group');
const Teacher = require('../models/Teacher');
const crypto = require('crypto');

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('department').populate('teachers');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getTeachersForGroup = async (req, res) => {
    const { password } = req.body;

    try {
        const group = await Group.findOne({ password });
        if (!group) {
            return res.status(401).json({ error: 'Invalid group credentials' });
        }

        const teachers = await Teacher.find({ _id: { $in: group.teachers } });
        res.json(teachers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.createGroup = async (req, res) => {
    const { name, department, teachers } = req.body;
    const password = crypto.randomBytes(8).toString('hex');
    const newGroup = new Group({
        name,
        department: department,
        password,
        teachers: teachers,
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateGroup = async (req, res) => {
    const { id } = req.params;
    const { name, department, password, teachers } = req.body;

    try {
        const updatedGroup = await Group.findByIdAndUpdate(
            id,
            { name, department: department, password, teachers: teachers },
            { new: true }
        )
            .populate('department')
            .populate('teachers');
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(updatedGroup);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteGroup = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedGroup = await Group.findByIdAndDelete(id);
        if (!deletedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json({ message: 'Group deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.assignTeachersToGroup = async (req, res) => {
    const { id } = req.params;
    const { teachers } = req.body;

    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const teacherss = await Teacher.find({ _id: { $in: teachers } });
        group.teachers = teacherss.map((teacher) => teacher._id);

        const updatedGroup = await group.save();
        res.json(updatedGroup);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
