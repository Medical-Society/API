const request = require('supertest');

const app = require('../app'); // Assuming the app.js file is in the parent directory
require('dotenv').config();
const mongoose = require('mongoose');

beforeAll(async () => {
    const url = process.env.MONGODB_URL;
    await mongoose.connect(url);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /api/v1/patients/forgot-password', () => {
    test('should return 200 if the patient forgot-password successfully', async () => {
        const res = await request(app).post('/api/v1/patients/forgot-password').send({
            email: 'eman@gmail.com'
        });
        // console.log(res);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    test('should return 400 if the patient forgot-password failed', async () => {
        const res = await request(app).post('/api/v1/patients/forgot-password').send({
            email: ''
        });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
