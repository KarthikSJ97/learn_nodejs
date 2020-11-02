const request = require('supertest');
const { Genre } = require('../../models/genre');
const {User} = require('../../models/user');
let server;

describe('auth middleware', () => {
    
    // Load the server before each test
    beforeEach(() => { server = require('../../index'); });
    // Close the server after each test
    afterEach(async() => {
        await Genre.remove({});
        await server.close();
    });

    let token;
    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({ name: 'genre1' });
    }

    beforeEach(() => {
        token = new User().generateAuthToken();
    });
    
    it('should return 401 if no token is provided', async() => {
        // We don't set token as null, because anything that is passed to set(),
        // is converted into string. Hence, it becomes "null"
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async() => {
        // We don't set token as null, because anything that is passed to set(),
        // is converted into string. Hence, it becomes "null"
        token = 'a';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async() => {
        // We don't set token as null, because anything that is passed to set(),
        // is converted into string. Hence, it becomes "null"
        const res = await exec();

        expect(res.status).toBe(200);
    })
})