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

describe('POST /api/v1/doctors/login', () => {
    test('should return 200 if the doctor login successfully', async () => {
        const res = await request(app).post('/api/v1/doctors/login').send({
            email: 'emanmohameed2002@gmail.com',
            password: '123123',
        });
        console.log(res);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    test('should return 400 if the doctor login failed', async () => {
        const res = await request(app).post('/api/v1/doctors/login').send({
            email: '',
            password: '',
        });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
