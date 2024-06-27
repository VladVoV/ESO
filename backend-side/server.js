const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require("cookie-session");
const cors = require("cors");
const User = require('./models/User');
const Group = require('./models/Group');
let jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const config = require("./config.js");
require('dotenv').config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(
    cookieSession({
        name: "pnu-project",
        keys: ["FGd@FJASfh#cx@"],
        httpOnly: true
    })
);


const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DB_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

require('./routes/routes')(app);

app.post('/auth/student', async (req, res) => {
    try {
        const { groupId, password } = req.body;
        console.log(req.body)
        const group = await Group.findById(groupId);

        if (!group || group.password !== password) {
            return res.status(401).json({ error: 'Invalid group credentials' });
        }

        res.json({ });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/auth/admin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user && user.password === req.body.password && user.role === 'admin') {
            const token = jwt.sign({ id: user.id, role: user.role }, config.secret, {
                algorithm: 'HS256',
                expiresIn: 86400, // 24 hours
            });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict' });
            res.status(200).send({ id: user._id, email: user.email, role: user.role });
        } else {
            res.status(401).json({ error: 'Invalid email credentials' });
        }
    } catch (error) {
        console.error('Error during signin:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.post('/admin/logout', async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: "You've been signed out!" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
