const request = require('supertest');
const mongoose = require('mongoose');

// Assuming the app.js file is in the parent directory
const app = require('../app');
require('dotenv').config();

beforeAll(async () => {
    const url = process.env.MONGODB_URL;
    await mongoose.connect(url);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('PATCH /api/v1/patients/updateMe', () => {
    test('should return 200 if the update patient successfully', async () => {
        const authRes = await request(app).post('/api/v1/patients/login').send({
            email: 'EmanTest@gmail.com',
            password: '1234567',
        });
        const token = authRes.body.data.token;

        const res = await request(app).patch('/api/v1/patients/updateMe').set('Authorization', `Bearer ${token}`).send({
            patientName: 'eman ibrahem',
            age: '55',
            address: '1234567',
            mobile: '01273191053',
        });

        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });

    test('should return 404 if the update patient failed', async () => {
        const res = await request(app).patch('/api/v1/patients/updateMe').send({});

        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
