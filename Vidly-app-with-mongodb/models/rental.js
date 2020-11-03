const mongoose = require('mongoose');
const Joi = require('joi');
const moment = require('moment');

// Rental Schema with new customer and movie schema to improve the query performance
const rentalSchema = mongoose.Schema({

    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 50
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: Number,
                required: true,
                minLength: 7,
                maxLength: 12
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                required: true,
                minLength: 3,
                maxLength: 50,
                trim: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }
});

// Adding a static method to fetch a rental
rentalSchema.statics.lookup = function(customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

// Adding an instance method to calculate and set the rental fee
rentalSchema.methods.return = function() {
    this.dateReturned = new Date();

    const rentalDays = moment().diff(this.dateOut, 'days');
    this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

// Generate Rental model
const Rental = mongoose.model('Rental', rentalSchema);

// Function to validate the request body against the rental schema
function validateRental(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };
    return Joi.validate(rental, schema);
}

module.exports.Rental = Rental;
module.exports.validateRental = validateRental;