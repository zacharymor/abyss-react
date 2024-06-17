const fs = require('fs');
const path = require('path');

const articlesFilePath = path.join(__dirname, '..', '..', 'data', 'articles.json');

function readArticlesData() {
    return JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
}

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const articles = readArticlesData();
    res.json(articles);
}
