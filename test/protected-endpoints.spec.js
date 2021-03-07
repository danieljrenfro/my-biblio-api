const supertest = require('supertest');
const { path } = require('../src/app');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Protected Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instanct', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  beforeEach('insert users', () => {
    return helpers.seedUsers(
      db,
      testUsers
    );
  });

  const protectedEndpoints = [
    {
      name: 'PUT /api/auth/token',
      path: '/api/auth/token',
      method: supertest(app).put,
    },
    {
      name: 'GET /api/borrows',
      path: '/api/borrows',
      method: supertest(app).get
    },
    {
      name: 'POST /api/borrows',
      path: '/api/borrows',
      method: supertest(app).post
    },
    {
      name: 'GET /api/borrows/:borrow_id',
      path: '/api/borrows/:borrow_id',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/borrows/:borrow_id',
      path: '/api/borrows/:borrow_id',
      method: supertest(app).patch
    },
    {
      name: 'GET /api/books',
      path: '/api/books',
      method: supertest(app).get
    },
    {
      name: 'POST /api/books',
      path: '/api/books',
      method: supertest(app).post
    },
    {
      name: 'GET /api/books/:book_id',
      path: '/api/books/:book_id',
      method: supertest(app).get
    },
    {
      name: 'PATCH /api/books/:book_id',
      path: '/api/books/:book_id',
      method: supertest(app).patch
    },
    {
      name: 'DELETE /api/books/:book_id',
      path: '/api/books/:book_id',
      method: supertest(app).delete
    },
    {
      name: 'GET /api/books/:book_id/borrows',
      path: '/api/books/:book_id',
      method: supertest(app).get
    }
  ];

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` });
      });

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUser;
        const invalidSecret = 'bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` });
      });

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { username: 'user-not-existy', id: 1 };
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` });
      });
    });
  });
});