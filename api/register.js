const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');

// Function to read users data from JSON file
function readUsersData() {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Function to write users data to JSON file
function writeUsersData(data) {
    fs.writeFileSync(usersFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { username, password, isAdmin } = req.body;
    const users = readUsersData();

    const existingUser = users.find(u => u.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { username, password: hashedPassword, isAdmin: isAdmin || false };
    users.push(newUser);
    writeUsersData(users);

    res.status(201).json({ message: 'User registered successfully' });
}
