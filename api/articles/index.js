const fs = require('fs');
const path = require('path');

const articlesFilePath = path.join(__dirname, '..', '..', 'data', 'articles.json');

function readArticlesData() {
    return JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
}

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const articles = readArticlesData();
    res.json(articles);
}
