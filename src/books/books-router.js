const express = require('express');
const path = require('path');

const BooksService = require('./books-service');
const { requireAuth } = require('../middleware/jwt-auth');

const booksRouter = express.Router();
const jsonBodyParser = express.json();

booksRouter
  .use(requireAuth);

booksRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const userBooks = await BooksService.getUserBooks(
        req.app.get('db'),
        req.user.id
      );
      
      res.json(userBooks);
    } catch(error) {
      next(error);
    }
  })
  .post(jsonBodyParser, async (req, res, next) => {
    const { title, authors, genre, format, status, borrowed } = req.body;

    try {
      // Checks for required fields
      const requiredFields = {title, authors, format, status, borrowed };
  
      for (const [key, value] of Object.entries(requiredFields)) {
        if (!value && typeof value === 'boolean')
          break;
  
        if (!value)
          return res.status(400).json({ error: `Missing '${key}' in request body` });
      }
  
      // Checks for correct values for format field
      const formatValues = ['Hardback', 'Paperback', 'E-Book', 'Audio'];
  
      if (!formatValues.includes(format)) 
        return res.status(400).json({ error: `Format must be 'Hardback', 'Paperback', 'E-Book' or 'Audio'` });
  
      // Checks for correct values for status field
      const statusValues = ['Read', 'Unread', 'Reading'];
  
      if (!statusValues.includes(status))
        return res.status(400).json({ error: `Status must be 'Read', 'Unread' or 'Reading'` });
  
      const book = {
        user_id: req.user.id,
        title,
        authors,
        genre,
        format,
        status,
        borrowed
      };
  
      // Inserts book into the database and returns newly created book.
      const newBook = await BooksService.insertBook(
        req.app.get('db'),
        book
      );
      
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newBook.id}`))
        .json(newBook);
    } catch(error) {
      next(error);
    }
  });
  
booksRouter
  .route('/:book_id')
  .use(async (req, res, next) => {
    
  })
  .get(async (req, res, next) => {
    // implement
    res.send();
  })
  .patch(jsonBodyParser, async (req, res, next) => {
    // implement
    res.send();
  })
  .delete(async (req, res, next) => {
    // implement
    res.send();
  });

booksRouter
  .route('/:book_id/borrows')
  .get(async (req, res, next) => {
    // implement
    res.send();
  });





module.exports = booksRouter;