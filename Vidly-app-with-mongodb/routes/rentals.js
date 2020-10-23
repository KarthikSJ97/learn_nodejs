const express = require('express');
const router = express.Router();
const {Rental, validateRental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

// Router to fetch all the movies that are rented
router.get('/', async(req, res) => {
    // Sort by rented out date in descending order
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

// Router to rent out a new movie
router.post('/', async(req, res) => {

    // Validate request body
    const {error} = validateRental(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Check if customer Id is valid
    const customer = await Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send(`Invalid customer Id: ${req.body.customerId}`);

    // Check if movie Id is valid
    const movie = await Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send(`Invalid movie Id: ${req.body.movieId}`);

    // Check if the movie is in stock
    if(movie.numberInStock === 0) return res.status(400).send('Movie not in stock');

    let rental = new Rental({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    // Save the rented out details
    rental = await rental.save();

    // Decrement the movie stock
    movie.numberInStock--;
    await movie.save();

    res.send(rental);
});

module.exports = router;