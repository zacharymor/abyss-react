const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

function readUsersData() {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password } = req.body;
    const users = readUsersData();
    const user = users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.SECRET_KEY);
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
}
