require('dotenv').config();
const express = require('express');
const cors = require('cors');
const formData = require("express-form-data");
const app = express();

const PORT = process.env.PORT | 3000;

const {Book} = require('./models');

const MOCK_USER = {id: 1, mail: 'test@mail.ru'};

const stor = {
    books: [],
};

[1, 2, 3].map(el => {
    const newBook = new Book(
        undefined,
        `Title ${el}`,
        `desc book ${el}`,
        `author ${el}`,
        `${el}`,
        `${el}`,
        `${el}`
    );
    stor.books.push(newBook);
});


app.use(formData.parse());
app.use(cors());


app.get('/', function (req, res) {
    // TODO show all api
    res.send('Hello World');
});

app.post('/api/user/login', function (req, res) {
    res.status(200);
   res.end(JSON.stringify(MOCK_USER));
});

app.get('/api/books', function (req, res) {
   res.status(200);
   res.end(JSON.stringify(stor.books));
});

app.get('/api/books/:id', function (req, res) {
    const {id} = req.params;
    const book = stor.books.find(b => b.id == id);
    res.status(200);
    res.end(JSON.stringify(book || {}));
});

app.post('/api/books', function (req, res) {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const book = new Book(undefined, title, description, authors, favorite, fileCover, fileName);
    stor.books.push(book);
    res.status(201);
    res.end(JSON.stringify(book));
});

app.put('/api/books/:id', function (req, res) {
    const {id} = req.params;
    const bookIdx = stor.books.findIndex(b => b.id == id);
    if (bookIdx == -1) {
        res.status(204);
        res.end();
    }
    // TODO add validators for required fields
    const book = {
        id,
        ...req.body
    };
    stor.books[bookIdx] = book;
    res.status(200);
    res.end(JSON.stringify(book));

});

app.delete('/api/books/:id', function (req, res) {
    const {id} = req.params;
    stor.books = stor.books.filter(b => b.id != id);
    res.status(200);
    res.end('ok');
});


app.listen(PORT);