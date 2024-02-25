const app = require('../app');
const db = require('../utils/setupDB');
const request = require('supertest');
const mongoose = require('mongoose');

beforeAll(async () => {
  await db.setUp();
});

// afterEach(async () => {
//     await db.dropCollections();
// });

// afterAll(async () => {
//     await mongoose.connection.close();
// });

describe('POST /api/v1/doctors/login', () => {
  test('should return 200 if the doctor signup successfully', async () => {
    const res = await request(app).post('/api/v1/doctors/signup').send({
      englishFullName: 'fikif',
      arabicFullName: 'فيكيف',
      email: 'fikif86177@tospage.com',
      password: '123123',
      confirmPassword: '123123',
      specialization: 'Psychologist',
      clinicAddress: 'ABC-22 st.',
      nationalID: '11112223111212',
      phoneNumber: '01207070707',
      birthdate: '1998/12/2',
      gender: 'male',
      isVerified: true,
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty(
      'message',
      'Dr. fikif signed up successfully, Please verify your email',
    );
  });
  test('should return 400 as doctor is not verified', async () => {
    const res = await request(app).post('/api/v1/doctors/login').send({
      email: 'fikif86177@tospage.com',
      password: '123123',
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('message', 'Please verify your email');
    await db.dropDatabase();
  });
  test('should return 200 if the doctor login successfully', async () => {
    await mongoose.connect(process.env.MONGODB_URL_EU);
    const res = await request(app).post('/api/v1/doctors/login').send({
      email: 'nodelete@gmail.com',
      password: '123123',
    });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty('data', {
      token: expect.any(String),
      doctor: expect.any(Object),
    });
    await mongoose.connection.close();
  });
});
