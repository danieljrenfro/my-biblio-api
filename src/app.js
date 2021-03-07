require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');
const borrowsRouter = require('./borrows/borrows-router');
const booksRouter = require('./books/books-router');
const errorHandler = require('../src/middleware/errorhandler');

const app = express();

// MIDDLEWARE
const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

// ROUTES
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/borrows', borrowsRouter);
app.use('/api/books', booksRouter);

// ERROR HANDLER
app.use(errorHandler);

module.exports = app;