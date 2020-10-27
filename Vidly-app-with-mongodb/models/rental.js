const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

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