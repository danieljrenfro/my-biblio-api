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
  .all(async (req, res, next) => {
    const { book_id } = req.params;
    
    try {
      const book = await BooksService.findBookById(
        req.app.get('db'),
        book_id
      );
      
      if (!book)
        return res.status(404).json({ error: `Book doesn't exist` });
      
      if (book.user_id !== req.user.id)
        return res.status(401).json({ error: `Book doesn't belong to you` });
  
      req.book = book;
      next();
    } catch(error) {
      next(error);
    }
  })
  .get(async (req, res) => {
    res.json(req.book);
  })
  .patch(jsonBodyParser, async (req, res, next) => {
    try {
      const { title, authors, genre, format, status, borrowed } = req.body;
      const bookToUpdate = {title, authors, genre, format, status, borrowed };
  
      const numberOfValues = Object.values(bookToUpdate).filter(Boolean).length;
      if (!numberOfValues) 
        return res.status(400).json({ error: `Request body must contain one of 'title', 'authors', 'genre', 'format', 'status', 'borrowed'` });
      
      // Validates 'format' update value
      const validFormats = ['Hardback', 'Paperback', 'E-Book', 'Audio'];

      if (format && !validFormats.includes(format))
        return res.status(400).json({ error: `Format must be updated with value of 'Hardback', 'Paperback', 'E-Book' or 'Audio'` });
      
      // Validates 'status' updated value
      const validStatus = ['Read', 'Unread', 'Reading'];

      if (status && !validStatus.includes(status))
        return res.status(400).json({ error: `Status must be updated with value of 'Read', 'Unread' or 'Reading'` });

      await BooksService.updateBook(
        req.app.get('db'),
        req.params.book_id,
        bookToUpdate
      );

      res.status(204).end();
    } catch(error) {
      next(error);
    }
  })
  .delete(async (req, res, next) => {
    try {
      await BooksService.deleteBook(
        req.app.get('db'),
        req.params.book_id
      );

      res.status(204).end();
    } catch(error) {
      next(error);
    }
  });

booksRouter
  .route('/:book_id/borrows')
  .all(async (req, res, next) => {
    try {
      const book = await BooksService.findBookById(
        req.app.get('db'),
        req.params.book_id
      );

      if (!book)
        return res.status(404).json({ error: `Book doesn't exist` });

      if (book.user_id !== req.user.id) 
        return res.status(401).json({ error: `Book doesn't belong to you` });
      
      req.book = book;
      next();
    } catch(error) {
      next(error);
    }
  })
  // eslint-disable-next-line no-unused-vars
  .get(async (req, res, next) => {
    const bookBorrows = await BooksService.getBookBorrows(
      req.app.get('db'),
      req.book.id
    );

    res.json(bookBorrows);
  });





module.exports = booksRouter;