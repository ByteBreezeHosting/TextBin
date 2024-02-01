const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');
const ansiHTML = require('ansi-html');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

const db = new sqlite3.Database('textdata.db');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Text (id INTEGER PRIMARY KEY AUTOINCREMENT, link TEXT, content TEXT, language TEXT)");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.post('/save', (req, res) => {
    const inputText = req.body.inputText;
    const randomLink = generateRandomLink();
    
    const stmt = db.prepare("INSERT INTO Text (link, content, language) VALUES (?, ?, ?)");
    stmt.run(randomLink, inputText, req.body.language || '');
    stmt.finalize();

    const link = `${process.env.URL}/${randomLink}`;
    res.render('result.ejs', { link });
});

app.get('/:link', (req, res) => {
    const link = req.params.link;

    db.get("SELECT content, language FROM Text WHERE link = ?", [link], (err, row) => {
        if (row) {
            const highlightedContent = ansiHTML(row.content);
            res.render('view.ejs', { content: highlightedContent, language: row.language });
        } else {
            res.status(404).render('404.ejs');
        }
    });
});



function generateRandomLink() {
    return Math.random().toString(36).substring(2, 8);
}

app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.URL}`);
});
