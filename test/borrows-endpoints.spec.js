const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../src/app');

const helpers = require('./test-helpers');

describe.only('Borrows Endpoints', function() {
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

  describe('GET /borrows', () => {
    context(`Given the database isn't empty`, () => {
      beforeEach('seed tables', () => helpers.seedTables(
        db,
        testUsers,
        testBooks,
        testBorrows
      ));

      it(`responds 200 and active borrows`, () => {
        return supertest(app)
          .get('/api/borrows')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200)
          .then(res => {
            expect(res.body[0].book_id).to.eql(testBorrows[1].book_id);
            expect(res.body[0]).to.have.property('date');
            expect(res.body[0].id).to.eql(testBorrows[1].id);
            expect(res.body[0].name).to.eql(testBorrows[1].name);
            expect(res.body[0].returned).to.eql(testBorrows[1].returned);
            expect(res.body[0].user_id).to.eql(testBorrows[1].user_id);
          });
      });
    });

    context(`Given the database is empty`, () => {
      beforeEach('seed users', () => helpers.seedUsers(db, testUsers));
      
      it(`responds with 200 and an empty array`, () => {
        return supertest(app)
          .get('/api/borrows')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .expect(200, []);
      });
    });
  });

  describe('POST /borrows', () => {
    beforeEach('seed tables', () => helpers.seedTables(
      db,
      testUsers,
      testBooks,
      testBorrows
    ));

    it(`responds 400 and 'Missing 'name' field in request body'`, () => {
      return supertest(app)
        .post('/api/borrows')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ irrelevantField: 'foo' })
        .expect(400, { error: `Missing 'name' field in request body` });
    });

    it(`responds 400 and 'Missing 'book_id' field in request body'`, () => {
      return supertest(app)
        .post('/api/borrows')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send({ name: 'foo' })
        .expect(400, { error: `Missing 'book_id' field in request body` });
    });


    it(`responds 201, location of new borrow, new borrow, and inserts borrow into db`, () => {
      const postBody = {
        name: 'Test Name',
        book_id: 3,
        id: 4
      };

      return supertest(app)
        .post('/api/borrows')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(postBody)
        .expect(201)
        .then(res => {
          expect(res.body.id).to.eql(4);
          expect(res.body).to.have.property('date');
          expect(res.body.user_id).to.eql(testUser.id);
          expect(res.body.name).to.eql('Test Name');
          expect(res.body.book_id).to.eql(3);
          expect(res.body.returned).to.eql(false);
          expect(res.headers.location).to.eql('/api/borrows/4');
        })
        .then(() => {
          return db('borrows')
            .select('*')
            .where('id', 4)
            .first()
            .then(borrow => {
              expect(borrow.id).to.eql(4);
              expect(borrow).to.have.property('date');
              expect(borrow.user_id).to.eql(testUser.id);
              expect(borrow.name).to.eql('Test Name');
              expect(borrow.book_id).to.eql(3);
              expect(borrow.returned).to.eql(false);
            });
        });
    });
  });

  describe('GET /borrows/:borrow_id', () => {
    beforeEach('seed tables', () => helpers.seedTables(
      db,
      testUsers,
      testBooks,
      testBorrows
    ));

    it(`responds 404 and 'Borrow doesn't exist'`, () => {
      return supertest(app)
        .get('/api/borrows/10')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(404, { error: `Borrow doesn't exist` });
    });

    it(`responds 401 and 'Borrow doesn't belong to you'`, () => {
      return supertest(app)
        .get('/api/borrows/1')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(401, { error: `Borrow doesn't belong to you` });
    });

    it(`responds 200 and returns the correct borrow`, () => {
      const expectedBorrow = testBorrows[1];
      
      return supertest(app)
        .get('/api/borrows/2')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .expect(200)
        .then(res => {
          expect(res.body.id).to.eql(expectedBorrow.id);
          expect(res.body).to.have.property('date');
          expect(res.body.name).to.eql(expectedBorrow.name);
          expect(res.body.returned).to.eql(expectedBorrow.returned);
          expect(res.body.user_id).to.eql(expectedBorrow.user_id);
          expect(res.body.book_id).to.eql(expectedBorrow.book_id);
        });
    });
  });
});