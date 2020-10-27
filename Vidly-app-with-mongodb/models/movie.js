const mongoose = require('mongoose');
const {genreSchema} = require('./genre');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

// Generate movie schema
const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 255,
        trim: true
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        min: 0,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        required: true
    }
});

// Generate movie model
const Movie = mongoose.model('Movie', movieSchema);

// Function to validate the request body against the movie schema
function validateMovie(movie) {
    const schema = {
        title: Joi.string().max(255).trim().required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required()
    }

    return Joi.validate(movie, schema);
}

module.exports.validateMovie = validateMovie;
module.exports.Movie = Movie;