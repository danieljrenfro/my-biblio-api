const express = require('express');
const path = require('path');
const UsersService = require('./users-service');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .post('/', jsonBodyParser, async (req, res, next) => {
    const { name, username, password } = req.body;

    for (const field of ['name', 'username', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    try {
      const passwordError = UsersService.validatePassword(password);

      if (passwordError)
        return res.status(400).json({ error: passwordError });
    
      const hasUserWithUserName = await UsersService.hasUserWithUserName(
        req.app.get('db'),
        username
      );

      if (hasUserWithUserName)
        return res.status(400).json({ error: 'Username already taken'});
    
      
      const hashedPassword = await UsersService.hashPassword(password);

      const newUser = {
        username,
        password: hashedPassword,
        name,
      };

      const user = await UsersService.insertUser(
        req.app.get('db'),
        newUser
      );

      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${user.id}`))
        .json(UsersService.serializeUser(user));
    } catch(error) {
      next(error);
    }
  });


module.exports = usersRouter;