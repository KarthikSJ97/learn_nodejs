const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
let server;
let customerId;
let movieId;
let rental;
let token;

describe('/api/returns', () => {
    
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }
    
    // Load the server before each test
    beforeEach(async() => {
        server = require('../../index');
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '1234567890'
            },
            movie: {
                _id: movieId,
                title: 'abcde',
                dailyRentalRate: 2
            }
        });
        // Populate the database
        await rental.save();
    });
    // Close the server and also clear the modifications made to the test database after each test
    afterEach(async() => { 
        await server.close();
        await Rental.remove({});
    });

    it('should return 401 if client is not logged in', async() => {
        
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async() => {
        
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async() => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for the customer/movie', async() => {
        await Rental.remove({});
        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async() => {
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();

        expect(res.status).toBe(400);
    });
});