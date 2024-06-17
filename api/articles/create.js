const fs = require('fs');
const path = require('path');

const articlesFilePath = path.join(__dirname, '..', '..', 'data', 'articles.json');

function readArticlesData() {
    return JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
}

function writeArticlesData(data) {
    fs.writeFileSync(articlesFilePath, JSON.stringify(data, null, 2), 'utf8');
}

export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { title, content } = req.body;
    const articles = readArticlesData();
    const newArticleID = articles.length ? articles[articles.length - 1].id + 1 : 1;
    const newArticle = { id: newArticleID, title, content };
    articles.push(newArticle);
    writeArticlesData(articles);
    res.status(201).json(newArticle);
}
