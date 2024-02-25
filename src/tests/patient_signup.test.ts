const request = require('supertest');

const app = require('../app'); // Assuming the app.js file is in the parent directory

const db = require('../utils/setupDB');

beforeAll(async () => {
  await db.setUp();
});

afterAll(async () => {
  await db.dropDatabase();
});

describe('POST /api/v1/patients/signup', () => {
  test('should return 201 if the patient signup successfully', async () => {
    const res = await request(app).post('/api/v1/patients/signup').send({
      patientName: 'Eman Mohamed',
      email: 'E23456@gmail.com',
      password: '12345677',
      confirmPassword: '12345677',
      birthdate: '2002-04-20',
      gender: 'male',
      address: 'elesmailia',
      mobile: '01273191052',
      isVerified: 'true',
    });

    // console.log(res);
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty('status', 'success');
  });
  test('should return 400 if the patient signup failed', async () => {
    const res = await request(app).post('/api/v1/patients/signup').send({
      patientName: 'Eman Mohamed',
      email: 'E23456@gmail.com',
      password: '12345677',
      confirmPassword: '12345677',
      birthdate: '2002-04-20',
      gender: 'male',
      address: 'elesmailia',
      mobile: '01273191052',
      isVerified: true,
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('status', 'fail');
  });
});
