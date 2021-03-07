const express = require('express');
const path = require('path');

const { requireAuth } = require('../middleware/jwt-auth');
const BorrowsService = require('./borrows-service');

const borrowsRouter = express.Router();
const jsonBodyParser = express.json();

borrowsRouter
  .use(requireAuth);

borrowsRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const borrows = await BorrowsService.getBorrows(
        req.app.get('db'),
        req.user.id
      );

      res.json(borrows);
    } catch(error) {
      next(error);
    }
  })
  .post(jsonBodyParser, async (req, res, next) => {
    try {
      const { name, book_id, id } = req.body;

      if (!name)
        return res.status(400).json({ error: `Missing 'name' field in request body` });

      if (!book_id)
        return res.status(400).json({ error: `Missing 'book_id' field in request body` });
      
      const data = { 
        id,
        name, 
        book_id,
        user_id: req.user.id
      };

      const newBorrow = await BorrowsService.insertBorrow(
        req.app.get('db'),
        data
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${newBorrow.id}`))
        .json(newBorrow);

    } catch(error) {
      next(error);
    }
  });

borrowsRouter
  .route('/:borrow_id')
  .all(async (req, res, next) => {
    try {
      const borrow = await BorrowsService.findBorrowById(
        req.app.get('db'),
        req.params.borrow_id
      );

      if (!borrow)
        return res.status(404).json({ error: `Borrow doesn't exist` });

      if (borrow.user_id !== req.user.id)
        return res.status(401).json({ error: `Borrow doesn't belong to you` });
      
      req.borrow = borrow;
      next();
    } catch(error) {
      next(error);
    }
  })
  .get(async (req, res) => {
    res.json(req.borrow);
  })
  .patch(async (req, res, next) => {
    res.send();
  });

module.exports = borrowsRouter;