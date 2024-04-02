const Department = require('../models/Department');

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createDepartment = async (req, res) => {
    const { name } = req.body;
    const newDepartment = new Department({ name });

    try {
        const savedDepartment = await newDepartment.save();
        res.status(201).json(savedDepartment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.updateDepartment = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedDepartment = await Department.findByIdAndUpdate(id, { name }, { new: true });
        if (!updatedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json(updatedDepartment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteDepartment = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedDepartment = await Department.findByIdAndDelete(id);
        if (!deletedDepartment) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
