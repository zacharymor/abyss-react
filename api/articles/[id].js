const fs = require('fs');
const path = require('path');

const articlesFilePath = path.join(__dirname, '..', '..', 'data', 'articles.json');

function readArticlesData() {
    return JSON.parse(fs.readFileSync(articlesFilePath, 'utf8'));
}

export default function handler(req, res) {
    const { id } = req.query;

    if (req.method === 'GET') {
        const articles = readArticlesData();
        const article = articles.find(a => a.id == id);
        if (article) {
            res.json(article);
        } else {
            res.status(404).send('Article not found');
        }
    } else if (req.method === 'PUT') {
        const { title, content } = req.body;
        const articles = readArticlesData();
        const articleIndex = articles.findIndex(a => a.id == id);
        if (articleIndex !== -1) {
            const updatedArticle = { ...articles[articleIndex], title, content };
            articles[articleIndex] = updatedArticle;
            fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
            res.json(updatedArticle);
        } else {
            res.status(404).send('Article not found');
        }
    } else if (req.method === 'DELETE') {
        const articles = readArticlesData();
        const articleIndex = articles.findIndex(a => a.id == id);
        if (articleIndex !== -1) {
            const deletedArticle = articles.splice(articleIndex, 1);
            fs.writeFileSync(articlesFilePath, JSON.stringify(articles, null, 2), 'utf8');
            res.json(deletedArticle[0]);
        } else {
            res.status(404).send('Article not found');
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
