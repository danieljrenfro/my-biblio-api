const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');

const helpers = require('./test-helpers');

describe.only('Books Endpoints', function() {
  const {
    testUsers,
    testBooks,
    testBorrows
  } = helpers.makeMyBiblioFixtures();

  const testUser = testUsers[0];
  
  let db;

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  before('clean tables', () => helpers.cleanTables(db));

  afterEach('clean tables', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());

  describe('GET /api/books endpoint', () => {
    context('Given the database has books', () => {
      beforeEach('seed the db', () => {
        return helpers.seedTables(db, testUsers, testBooks, testBorrows);
      });

      it('responds 200 and only returns books that belong to user', () => {
        const userBooks = testBooks.filter(book => book.user_id === testUser.id);

        return supertest(app)
          .get('/api/books')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, userBooks);
      });
    });

    context('Given the database is empty', () => {
      beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
      
      it('responds 200 and empty array', () => {  
        return supertest(app)
          .get('/api/books')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, []);
      });
    });
  });

  describe('POST /api/books endpoint', () => {
    beforeEach('seed users', () => helpers.seedUsers(db, testUsers));

    const requiredFields = ['title', 'authors', 'format', 'status', 'borrowed'];

    requiredFields.forEach(field => {
      const postBody = {
        title: 'test title',
        authors: 'test author', 
        format: 'Hardback',
        status: 'Read',
        borrowed: false
      };
      
      it(`responds 400 and 'Missing '${field}' in request body`, () => {
        delete postBody[field];

        return supertest(app)
          .post('/api/books')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(postBody)
          .expect(400, { error: `Missing '${field}' in request body` });
      });
    });

    it(`responds 400 error when format is not 'Hardback', 'Paperback', 'E-Book', or 'Audio'`, () => {
      const invalidFormat = {
        title: 'test title',
        authors: 'test author',
        format: 'Digital',
        status: 'Read',
        borrowed: false
      };

      return supertest(app)
        .post('/api/books')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(invalidFormat)
        .expect(400, { error: `Format must be 'Hardback', 'Paperback', 'E-Book' or 'Audio'` });
    });

    it(`responds 400 error when status is not 'Read', 'Unread' or 'Reading'`, () => {
      const invalidStatus = {
        title: 'test title',
        authors: 'test author',
        format: 'Audio',
        status: 'In the middle',
        borrowed: false
      };

      return supertest(app)
        .post('/api/books')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(invalidStatus)
        .expect(400, { error: `Status must be 'Read', 'Unread' or 'Reading'` });
    });

    it(`responds 201, returns the book and inserts the book into the db`, () => {
      const testBook = {
        id: 1,
        user_id: 1,
        title: 'test title',
        authors: 'test authors',
        genre: 'test genre',
        format: 'Audio',
        status: 'Read',
        borrowed: false
      };

      return supertest(app)
        .post('/api/books')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(testBook)
        .expect(201, testBook)
        .expect(res => {
          expect(res.headers.location).to.eql(`/api/books/${testBook.id}`);
        })
        .then(res =>
          db
            .from('books')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row).to.eql(testBook);
            })
        );
    });
  });

  describe('GET /api/books/:book_id', () => {
    context(`Given the database isn't empty`, () => {
      beforeEach('seed tables', () => helpers.seedTables(
        db, 
        testUsers,
        testBooks,
        testBorrows
      ));

      it(`responds 401 and 'Book doesn't belong to you`, () => {

      });
    });

    context(`Given the database is empty`, () => {
      beforeEach('seed users', () => helpers.seedUsers(db, testUsers));

      it(`responds 404 and 'Book doesn't exist'`, () => {
        
      });
    });
  });
});