const request = require('supertest');

const app = require('../app'); // Assuming the app.js file is in the parent directory
require('dotenv').config();
const mongoose = require('mongoose');

beforeAll(async () => {
    const url = process.env.MONGODB_URL_EU;
    await mongoose.connect(url);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/v1/patients', () => {
    test('should return 200 if the Get All patients  successfully', async () => {
        const authRes = await request(app).post('/api/v1/admins/login').send({
            email: 'emanmohamed@gp.team.mss',
            password: 'EmanMohamed@mss',
        });
        // console.log('auth', authRes);
        const token = authRes.body.data.token;
        // console.log('token', token);
        const res = await request(app).get('/api/v1/patients/').set('Authorization', `Bearer ${token}`);

        // console.log(res);
        expect(res.status).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
    });
    test('should return 401 if the Get All patients failed', async () => {
        const res = await request(app).get('/api/v1/patients').send({});
        expect(res.status).toEqual(401);
        expect(res.body).toHaveProperty('status', 'fail');
    });
});
