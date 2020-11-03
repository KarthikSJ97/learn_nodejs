const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');
const Joi = require('joi');
const validate = require('../middleware/validate');

// Route to return the rented out movie
router.post('/', [auth, validate(validateReturn)], async(req, res) => {
    
    // fetch the rental
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send('Rental not found');

    // Check if rental already processed
    if(rental.dateReturned) return res.status(400).send('return already processed');
    
    rental.dateReturned = new Date();
    const rentalDays = moment().diff(rental.dateOut, 'days');
    rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;
    await Movie.update({ _id: rental.movie._id }, {
        $inc: { numberInStock: 1 }
    })
    await rental.save();

    return res.status(200).send(rental);
});

// Validate if the customerId and movieId exists
function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }
    return Joi.validate(req, schema);
}

module.exports = router;