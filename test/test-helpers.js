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

function makeBooksArray() {
  return [
    {
      id: 1,
      user_id: 1,
      title: 'The Fellowship of the Ring',
      authors: 'J.R.R. Tolkien',
      genre: 'Fantasy, Fiction',
      format: 'Hardback',
      status: 'Read',
      borrowed: true
    },
    {
      id: 2,
      user_id: 1,
      title: 'The Two Towers',
      authors: 'J.R.R. Tolkien',
      genre: 'Fantasy, Fiction',
      format: 'Hardback',
      status: 'Unread',
      borrowed: false
    },
    {
      id: 3,
      user_id: 1,
      title: 'The Return of the King',
      authors: 'J.R.R. Tolkien',
      genre: 'Fantasy, Fiction',
      format: 'Hardback',
      status: 'Unread',
      borrowed: false
    },
    {
      id: 4,
      user_id: 2,
      title: 'The Hobbit',
      authors: 'J.R.R. Tolkien',
      genre: 'Fantasy, Fiction',
      format: 'Hardback',
      status: 'Read',
      borrowed: true
    },
    {
      id: 5,
      user_id: 2,
      title: 'The Silmarillion',
      authors: 'J.R.R. Tolkien',
      genre: 'Fantasy, Fiction',
      format: 'Hardback',
      status: 'Unread',
      borrowed: false
    }
  ];
}

function makeBorrowsArray() {
  return [
    {
      id: 1,
      name: 'Daniel Renfro',
      returned: false,
      book_id: 4
    },
    {
      id: 2,
      name: 'Evan Cook',
      returned: false,
      book_id: 1
    }
  ];
}

function makeMyBiblioFixtures() {
  const testUsers = makeUsersArray();
  const testBooks = makeBooksArray();
  const testBorrows = makeBorrowsArray();
  return { testUsers, testBooks, testBorrows };
}

function cleanTables(db) {
  return db
    .raw(
      `TRUNCATE
        users,
        books,
        borrows
        RESTART IDENTITY`
    );
}

// function cleanTables(db) {
//   return db.transaction(trx =>
//     trx.raw(
//       `TRUNCATE
//         "borrows",
//         "books",
//         "users"`
//     )
//       .then(() =>
//         Promise.all([
//           trx.raw(`ALTER SEQUENCE borrows_id_seq minvalue 0 START WITH 1`),
//           trx.raw(`ALTER SEQUENCE books_id_seq minvalue 0 START WITH 1`),
//           trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
//           trx.raw(`SELECT setval('borrows_id_seq', 0)`),
//           trx.raw(`SELECT setval('books_id_seq', 0)`),
//           trx.raw(`SELECT setval('users_id_seq', 0)`),
//         ])
//       )
//   );
// }

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .insert(preppedUsers)
    .into('users');
}

async function seedTables(db, users, books, borrows) {
  await seedUsers(db, users);
  
  await db
    .insert(books)
    .into('books');
    
  await db
    .insert(borrows)
    .into('borrows');
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
  makeBooksArray,
  makeBorrowsArray,
  cleanTables,
  seedUsers,
  makeAuthHeader,
  makeMyBiblioFixtures,
  seedTables,
};