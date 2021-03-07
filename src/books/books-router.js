const express = require('express');

const BooksService = require('./books-service');
const { requireAuth } = require('../middleware/jwt-auth');

const booksRouter = express.Router();
const jsonBodyParser = express.json();

booksRouter
  .use(requireAuth);

booksRouter
  .route('/')
  .get((req, res, next) => {
    // implement
    res.send();
  })
  .post(jsonBodyParser, (req, res, next) => {
    // implement
    res.send();
  });
  
booksRouter
  .route('/:book_id')
  .get((req, res, next) => {
    // implement
    res.send();
  })
  .patch(jsonBodyParser, (req, res, next) => {
    // implement
    res.send();
  })
  .delete((req, res, next) => {
    // implement
    res.send();
  });

booksRouter
  .route('/:book_id/borrows')
  .get((req, res, next) => {
    // implement
    res.send();
  });





module.exports = booksRouter;