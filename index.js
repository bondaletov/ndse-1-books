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
    res.json(MOCK_USER);
});

app.get('/api/books', function (req, res) {
   res.status(200);
   res.json(stor.books);
});

app.get('/api/books/:id', function (req, res) {
    const {id} = req.params;
    const book = stor.books.find(b => b.id == id);
    if (book) {
        res.status(200);
        res.json(book);
    } else {
        res.status(404);
        res.json({});
    }
});

app.post('/api/books', function (req, res) {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
    const book = new Book(undefined, title, description, authors, favorite, fileCover, fileName);
    stor.books.push(book);/api/books/:id
    res.status(201);
    res.json(book);
});

app.put('/api/books/:id', function (req, res) {
    const {id} = req.params;
    const bookIdx = stor.books.findIndex(b => b.id == id);
    if (bookIdx == -1) {
        res.status(404);
        res.end("Not found");
        return;
    }
    // TODO add validators for required fields
    const book = {
        id,
        ...req.body
    };
    stor.books[bookIdx] = book;
    res.status(200);
    res.json(book);
});

app.delete('/api/books/:id', function (req, res) {
    const {id} = req.params;
    stor.books = stor.books.filter(b => b.id != id);
    res.status(200);
    res.end('ok');
});


app.listen(PORT);