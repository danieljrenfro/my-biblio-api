const bcrypt = require('bcrypt');

// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  findUser(db, id) {
    return db('users')
      .where({ id })
      .first();
  },
  hasUserWithUserName(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  validatePassword(password) {
    if (password.length < 8)
      return 'Password must be 8 or more characters';
    
    if (password.length >= 72)
      return 'Password must be less than 72 characters';
    
    if (password.startsWith(' ') || password.endsWith(' '))
      return 'Password must not begin or end with empty spaces';
    
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password))
      return 'Password must contain one upper case, lower case, number and special character';

    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  serializeUser(user) {
    return {
      id: user.id,
      name: user.name,
      username: user.username
    };
  }
};

module.exports = UsersService;

