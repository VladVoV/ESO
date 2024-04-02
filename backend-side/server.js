const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const User = require('./models/User');
const Group = require('./models/Group');
const authRole = require('./middleware/authRole');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.DB_MONGOOSE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Middleware
app.use(express.json());

// Routes
require('./routes/routes')(app);

// Authentication Route for Students
app.post('/auth/student', async (req, res) => {
    try {
        const { groupId, password } = req.body;
        console.log(req.body)
        const group = await Group.findById(groupId);

        if (!group || group.password !== password) {
            return res.status(401).json({ error: 'Invalid group credentials' });
        }

        // Optionally, you can create a JWT token or session for the student
        const token = 'your_token_generation_logic';

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
