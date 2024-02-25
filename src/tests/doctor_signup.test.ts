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

describe('POST /api/v1/doctors/signup', () => {
  test('should return 200 if the doctor signup successfully', async () => {
    const res = await request(app).post('/api/v1/doctors/signup').send({
      englishFullName: 'fikif',
      arabicFullName: 'فيكيف',
      email: 'fikif86177@tospage.com',
      password: '123123',
      specialization: 'Psychologist',
      clinicAddress: 'ABC-22 st.',
      nationalID: '11112223111212',
      phoneNumber: '01207070707',
      birthdate: '2001/11/22',
      gender: 'male',
      isVerified: true,
      status: 'pending',
    });
    expect(res.status).toEqual(201);
    expect(res.body).toHaveProperty(
      'message',
      'Dr. fikif signed up successfully, Please verify your email',
    );
  });
  test('should return 400 if the doctor signup failed', async () => {
    const res = await request(app).post('/api/v1/doctors/signup').send({
      englishFullName: 'fikif',
      arabicFullName: 'فيكيف',
      email: 'fikif86177@tospage.com',
      password: '123123',
      specialization: 'Psychologist',
      clinicAddress: 'ABC-22 st.',
      nationalID: '11112223111212',
      phoneNumber: '01207070707',
      birthdate: '2001/11/22',
      gender: 'male',
      isVerified: true,
      status: 'pending',
    });
    expect(res.status).toEqual(400);
    expect(res.body).toHaveProperty('message', 'This email already exist');
  });
});
