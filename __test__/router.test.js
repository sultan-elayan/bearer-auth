'use strict';

process.env.SECRET = "SECRET KEY";

const supertest = require('supertest');
const server = require('../scr/server').server;
const { db } = require('../scr/server');

const mockRequest = supertest(server);

let user = {
  admin: { username: 'admin', password: 'password' },
  editor: { username: 'editor', password: 'password' },
  user: { username: 'user', password: 'password' },
};

beforeAll(async (done) => {
  await db.sync();
  // done();
});
afterAll(async (done) => {
  await db.drop();
  // done();
});


describe('Auth Router', () => {

  Object.keys(user).forEach(userType => {

    describe(`${userType} user`, () => {

      it('can create one', async (done) => {

        const response = await mockRequest.post('/signup').send(user[userType]);
        const userObject = response.body;

        expect(response.status).toBe(201);
        expect(userObject.token).toBeDefined();
        expect(userObject.user.id).toBeDefined();
        expect(userObject.user.username).toEqual(user[userType].username)
        done();
      });

      it('can signin with basic', async (done) => {

        const response = await mockRequest.post('/signin')
          .auth(user[userType].username, user[userType].password);

        const userObject = response.body;
        expect(response.status).toBe(200);
        expect(userObject.token).toBeDefined();
        expect(userObject.user.id).toBeDefined();
        expect(userObject.user.username).toEqual(user[userType].username)
        done();
      });

      it('can signin with bearer', async (done) => {

        // First, use basic to login to get a token
        const response = await mockRequest.post('/signin')
          .auth(user[userType].username, user[userType].password);

        const token = response.body.token;

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/user')
          .set('Authorization', `Bearer ${token}`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(200);
        done();
      });

    });

    describe('bad logins', () => {
      it('basic fails with known user and wrong password ', async (done) => {

        const response = await mockRequest.post('/signin')
          .auth('admin', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined();
        done();
      });

      it('basic fails with unknown user', async (done) => {

        const response = await mockRequest.post('/signin')
          .auth('nobody', 'xyz')
        const userObject = response.body;

        expect(response.status).toBe(403);
        expect(userObject.user).not.toBeDefined();
        expect(userObject.token).not.toBeDefined()
        done();
      });

      it('bearer fails with an invalid token', async (done) => {

        // First, use basic to login to get a token
        const bearerResponse = await mockRequest
          .get('/user')
          .set('Authorization', `Bearer foobar`)

        // Not checking the value of the response, only that we "got in"
        expect(bearerResponse.status).toBe(403);
        done();
      })
    })

  });

});
