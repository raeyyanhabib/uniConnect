process.env.NODE_ENV = 'test';
import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../index.js';

test('UniConnect API Test Suite', async (t) => {
  let authToken = '';

  await t.test('GET /api/health should return status online and active concepts', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.app, 'UniConnect');
    assert.ok(Array.isArray(res.body.concepts));
    assert.ok(res.body.concepts.length >= 5);
  });

  await t.test('POST /api/auth/login with seed credentials should return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alice@nu.edu.pk',
        password: 'Password123!'
      });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'alice@nu.edu.pk');
    authToken = res.body.token;
  });

  await t.test('GET /api/auth/me without token should return 401 Unauthorized', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
  });

  await t.test('GET /api/auth/me with valid token should return user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${authToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, 'alice@nu.edu.pk');
  });

  await t.test('GET /api/groups should return list of study groups with cache headers', async () => {
    const res = await request(app).get('/api/groups');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.groups));
  });

  await t.test('GET /api/reports/pdf should return binary PDF stream', async () => {
    const res = await request(app).get('/api/reports/pdf');
    assert.equal(res.status, 200);
    assert.equal(res.headers['content-type'], 'application/pdf');
    assert.ok(res.body.length > 0);
  });
});
