const Group = require('../models/Group');
const Teacher = require('../models/Teacher');

exports.getAllGroups = async (req, res) => {
    try {
        const groups = await Group.find().populate('department').populate('teachers');
        res.json(groups);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createGroup = async (req, res) => {
    const { name, department, password, teachers } = req.body;
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
