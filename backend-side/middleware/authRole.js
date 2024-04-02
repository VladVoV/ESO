// middleware/authRole.js
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Group = require('../models/Group');

const authRole = (...roles) => {
    return async (req, res, next) => {
        try {
            // Check if the user is an admin
            if (roles.includes('admin')) {
                const { email, password } = req.body;
                const admin = await User.findOne({ email, role: 'admin' });
                if (admin && (await bcrypt.compare(password, admin.password))) {
                    req.user = admin;
                    return next();
                }
                return res.status(401).send({ error: 'Invalid admin credentials' });
            }

            // Check if the user is a student
            if (roles.includes('student')) {
                const { groupId, password } = req.body;
                const group = await Group.findById(groupId);
                if (group && group.password === password) {
                    req.user = { role: 'student', groupId };
                    return next();
                }
                return res.status(401).send({ error: 'Invalid group password' });
            }

            // If the user is neither an admin nor a student, return an error
            return res.status(403).send({ error: 'You are not authorized to perform this action' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ error: 'Internal server error' });
        }
    };
};

module.exports = authRole;
