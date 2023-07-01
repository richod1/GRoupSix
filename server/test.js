const request = require('supertest');
const app = require('./routes/auth'); 

describe('POST /register', () => {
  it('should create a new user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    };

    // Make the POST request using supertest
    const response = await request(app)
      .post('/register')
      .send(userData);

    // Assert the response
    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('User Saved to db');
    expect(response.body.data).toBeDefined();
  });

  it('should return an error for invalid data', async () => {
    const invalidData = {
      username: 'testuser',
      email: 'test@example.com',
      
    };

    const response = await request(app)
      .post('/register')
      .send(invalidData);

    expect(response.status).toBe(500);
    expect(response.body.err).toBe('something went wrong');
  });
});
