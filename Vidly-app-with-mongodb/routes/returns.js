const express = require('express');
const router = express.Router();
const {Rental} = require('../models/rental');
const { Movie } = require('../models/movie');
const auth = require('../middleware/auth');
const moment = require('moment');

// Route 
router.post('/', auth, async(req, res) => {
    
    // Validate if the customerId and movieId exists
    if(!req.body.customerId) return res.status(400).send('customerId not provided');
    if(!req.body.movieId) return res.status(400).send('movieId not provided');

    // fetch the rental
    const rental = await Rental.findOne({
        'customer._id': req.body.customerId,
        'movie._id': req.body.movieId
    });
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

module.exports = router;