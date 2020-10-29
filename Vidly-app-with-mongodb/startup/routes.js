const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals')
const users = require('../routes/users');
const auth = require('../routes/auth');
const express = require('express');
const error = require('../middleware/error');

module.exports = function(app) {
    // Middleware which only processes requests having Content-Type as application/json
    app.use(express.json());

    // Middleware for routing to genres related APIs'
    app.use('/api/genres', genres);

    // Middleware for routing to customers related APIs'
    app.use('/api/customers', customers);

    // Middleware for routing to movies related APIs'
    app.use('/api/movies', movies);

    // Middleware for routing to rentals related APIs'
    app.use('/api/rentals', rentals);

    // Middleware for routing to users related APIs'
    app.use('/api/users', users);

    // Middleware for routing to auth related APIs'
    app.use('/api/auth', auth);

    // Middleware to handle exceptions globally
    app.use(error);

}