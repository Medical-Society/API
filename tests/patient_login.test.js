const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming the app.js file is in the parent directory
const db = require('../utils/setupDB');

beforeAll(async () => {
    await db.setUp();
});

describe('POST /api/v1/patients/login', () => {
    test('should return 200 if the patient signup successfully', async () => {
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
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty( 'message', 'Eman Mohamed Sign up successfully ,please verify your email');
    });
    test('should return 400 as patient is not verified', async () => {
        const res = await request(app).post('/api/v1/patients/login').send({
            email: 'E23456@gmail.com',
            password: '12345677',
        });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Please verify your email');
        await db.dropDatabase();
    });
    test('should return 200 if the patient login successfully', async () => {
        await mongoose.connect(process.env.MONGODB_URL);
        const res = await request(app).post('/api/v1/patients/login').send({
            email: 'EmanTest@gmail.com',
            password: '1234567',
        });
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('data', { token: expect.any(String), patient: expect.any(Object) });
        await mongoose.connection.close();
    });
});
