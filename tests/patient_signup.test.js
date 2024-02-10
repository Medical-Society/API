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

describe('POST /api/v1/patients/signup', () => {
    test('should return 200 if the patient signup successfully', async () => {
        const res = await request(app).post('/api/v1/patients/signup').send({
            patientName: 'nosa Mohamed',
            email: 'emanMohamedAhmed@gmail.com',
            password: '12345677',
            confirmPassword: '12345677',
            age: '25',
            gender: 'male',
            address: 'elesmailia',
            mobile: '01273191052',
        });
        // console.log(res);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    test('should return 400 if the patient signup failed', async () => {
        const res = await request(app).post('/api/v1/patients/signup').send({
            patientName: '',
            email: '',
            password: '',
            confirmPassword: '',
            age: '',
            gender: '',
            address: '',
            mobile: '',
        });
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
