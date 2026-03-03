const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// --- MOCK DATABASE ---
let users = [];
let otpStore = {};

// 1. SEND OTP
app.post('/api/v1/send-otp', (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    console.log(`[SERVER] OTP for ${email} is: ${otp}`);
    res.json({ message: "OTP sent successfully!" });
});

// 2. VERIFY OTP
app.post('/api/v1/verify-otp', (req, res) => {
    const { email, otp, type } = req.body;
    const stored = otpStore[email];
    console.log(`[OTP CHECK] email="${email}" type="${type}" submitted="${otp}" stored="${stored}"`);

    // Normalise both to strings and trim whitespace just in case
    if (stored && stored.toString().trim() === otp.toString().trim()) {
        delete otpStore[email];
        res.json({ message: "OTP verified!" });
    } else {
        res.status(400).json({ message: "Invalid code. Please try again." });
    }
});

// 3. REGISTER USER
app.post('/api/v1/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const newUser = {
        _id: Date.now().toString(),
        name,
        email,
        password,
        role,
        isVerified: false,
        isActive: false,
        createdAt: new Date().toISOString()
    };
    users.push(newUser);
    res.json({ user: newUser });
});

// 4. LOGIN USER
app.post('/api/v1/login', (req, res) => {
    const { email, password, role } = req.body;
    const user = users.find(u => u.email === email && u.password === password && u.role === role);
    if (user) {
        res.json({ user });
    } else {
        res.status(401).json({ message: "Invalid email, password, or role." });
    }
});

// 5. RESET PASSWORD
app.post('/api/v1/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.password = newPassword;
    res.json({ message: "Password updated successfully." });
});

// 6. GET ALL USERS (admin)
app.get('/api/v1/users', (req, res) => {
    const safe = users.map(({ password, ...rest }) => rest);
    res.json(safe);
});

// 7. GET SINGLE USER BY ID
app.get('/api/v1/user/:id', (req, res) => {
    const user = users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const { password, ...safe } = user;
    res.json({ user: safe });
});

// 8. APPROVE USER  ← must be before PUT /user/:id
app.put('/api/v1/user/:id/approve', (req, res) => {
    const user = users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.isVerified = true;
    user.isActive   = true;
    const { password, ...safe } = user;
    res.json({ user: safe });
});

// 9. UPDATE USER (name, etc.)
app.put('/api/v1/user/:id', (req, res) => {
    const user = users.find(u => u._id === req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    const { name } = req.body;
    if (name) user.name = name;
    const { password, ...safe } = user;
    res.json({ user: safe });
});

// 10. DELETE USER
app.delete('/api/v1/user/:id', (req, res) => {
    const idx = users.findIndex(u => u._id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: "User not found." });
    users.splice(idx, 1);
    res.json({ message: "User deleted." });
});

// --- EXISTING ASSESSMENT ROUTE ---
app.post('/api/v1/assess', (req, res) => {
    const pythonProcess = spawn('python3', ['gemini_integration.py', req.body.userInput]);
    pythonProcess.stdout.on('data', (data) => {
        res.json({ analysis: data.toString() });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Pathwise Server running at http://localhost:${PORT}`);
    console.log(`Routes available:`);
    console.log(`  POST /api/v1/send-otp`);
    console.log(`  POST /api/v1/verify-otp`);
    console.log(`  POST /api/v1/register`);
    console.log(`  POST /api/v1/login`);
    console.log(`  POST /api/v1/reset-password`);
    console.log(`  GET  /api/v1/users`);
    console.log(`  GET  /api/v1/user/:id`);
    console.log(`  PUT  /api/v1/user/:id/approve`);
    console.log(`  PUT  /api/v1/user/:id`);
    console.log(`  DELETE /api/v1/user/:id`);
});