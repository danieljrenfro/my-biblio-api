const express = require('express');

const { requireAuth } = require('../middleware/jwt-auth');
const BorrowsService = require('./borrows-service');

const borrowsRouter = express.Router();
const jsonBodyParser = express.json();

borrowsRouter
  .use(requireAuth);

borrowsRouter
  .route('/')
  .get((req, res, next) => {
    res.send();
  })
  .post(jsonBodyParser, (req, res, next) => {
    res.send();
  });

borrowsRouter
  .route('/:borrow_id')
  .get((req, res, next) => {
    res.send();
  })
  .patch((req, res, next) => {
    res.send();
  });

module.exports = borrowsRouter;