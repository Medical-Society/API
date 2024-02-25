const app = require('../app');
const db = require('../utils/setupDB');
const request = require('supertest');

beforeAll(async () => {
  await db.setUp();
});

// afterEach(async () => {
//     await db.dropCollections();
// });

afterAll(async () => {
  await db.dropDatabase();
});

describe('POST /api/v1/doctors/login', () => {
  test('should return 200 success on not existing email', async () => {
    const res = await request(app)
      .post('/api/v1/doctors/forgot-password')
      .send({
        email: 'vv@gmail.com',
      });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Reset password link sent to vv@gmail.com',
    );
  });
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
      birthdate: '2018',
      gender: 'male',
      isVerified: true,
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty(
      'message',
      'Dr. fikif signed up successfully, Please verify your email',
    );
  });
  test('should return 200 success on existing email', async () => {
    const res = await request(app)
      .post('/api/v1/doctors/forgot-password')
      .send({
        email: 'fikif86177@tospage.com',
      });
    expect(res.status).toEqual(200);
    expect(res.body).toHaveProperty(
      'message',
      'Reset password link sent to fikif86177@tospage.com',
    );
  });
});
