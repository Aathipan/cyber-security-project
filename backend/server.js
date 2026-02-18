// Testing Automatic Deployment 

require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- 1. CONNECT TO MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DATABASE CONNECTED: MongoDB is Live!'))
  .catch(err => console.error('❌ DATABASE ERROR:', err));

// --- 2. DEFINE THE USER MODEL ---
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// --- 3. API ROUTES ---

// Base route for health check
app.get('/api/', (req, res) => {
    res.send("Backend is Connected to MongoDB!");
});

// ROUTE 1: SIGN UP (Registration)
app.post('/api/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation: Check if fields are empty
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists. Go to Login." });
        }

        // Create and save new user
        const newUser = new User({ username, password });
        await newUser.save();

        console.log(`[REGISTRATION] New User Created: ${username}`);
        res.json({ success: true, message: "Registration successful! You can now authenticate." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error during registration" });
    }
});

// ROUTE 2: LOGIN (Authentication)
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validation: Check if fields are empty
        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Please enter both username and password" });
        }

        // 1. Search for user by username
        const user = await User.findOne({ username });

        // Logic: If user not found in DB
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "No account found with this username. Please Register first." 
            });
        }

        // 2. Check if the password matches the one in DB
        if (user.password === password) {
            console.log(`[AUTH] Successful login for: ${username}`);
            res.json({ 
                success: true, 
                message: `Welcome back, ${username}! Authentication successful.` 
            });
        } else {
            console.log(`[AUTH] Failed login attempt for: ${username}`);
            res.status(401).json({ 
                success: false, 
                message: "Wrong password. Please try again." 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error during authentication" });
    }
});

// --- 4. START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Backend running on IPv4 port ${PORT}`);
});
