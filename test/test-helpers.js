const knex = require('knex');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DATABASE_URL
  });
}

function makeUsersArray() {
  return [
    {
      id: 1,
      username: 'test-user-1',
      name: 'Test User 1',
      password: 'password'
    },
    {
      id: 2,
      username: 'test-user-2',
      name: 'Test User 2',
      password: 'password'
    }
  ]; 
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
      users
      RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .insert(preppedUsers)
    .into('users');
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.username,
    algorithm: 'HS256'
  });
  return `Bearer ${token}`;
}

module.exports = {
  makeKnexInstance,
  makeUsersArray,
  cleanTables,
  seedUsers,
  makeAuthHeader,
};