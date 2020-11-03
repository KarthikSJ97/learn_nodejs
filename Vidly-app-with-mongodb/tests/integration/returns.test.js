const request = require('supertest');
const { Rental } = require('../../models/rental');
const { User } = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');
const { Movie } = require('../../models/movie');
let server;
let customerId;
let movieId;
let rental;
let token;
let movie;

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
        movie = new Movie({
            _id: movieId,
            title: 'abcde',
            dailyRentalRate: 2,
            genre: { name: 'genre1' },
            numberInStock: 10
        });
        // Populate the database
        await movie.save();
        await rental.save();
    });
    // Close the server and also clear the modifications made to the test database after each test
    afterEach(async() => { 
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
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

    it('should return 200 if we have a valid request', async() => {
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the dateReturned if input is valid', async() => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);

    });

    it('should set the rentalFee if input is valid', async() => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();
        
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });

    it('should increase the movie stock if input is valid', async() => {
        const res = await exec();

        const movieInDb = await Movie.findById(movie._id);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return the rental if input is valid', async() => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie']))
    });
});