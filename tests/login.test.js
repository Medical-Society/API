const axios = require('axios');

describe('Doctor Login API', () => {
    test('Login with valid credentials should return a token', async () => {
        const response = await axios.post('http://localhost:3000/api/v1/doctors/login', {
            email: 'emanmohameed2002@gmail.com',
            password: '123123',
        });
        // Assuming the API returns a token upon successful login
        expect(response.status).toBe(200);
        expect(response.data.data).toHaveProperty('token');
    });

    test('Login with invalid credentials should return an error', async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/doctors/login', {
                email: 'invalid_email',
                password: 'invalid_password',
            });
        } catch (error) {
            console.log(error);
            expect(error.response.status).toBe(400);
            expect(error.response.data.message).toEqual('Invalid email or password');
        }
    });
});
