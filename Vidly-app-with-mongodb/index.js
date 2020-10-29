// Require express-async-errors to handle exceptions globally and pass the control to error.js middleware
require('express-async-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals')
const users = require('./routes/users');
const auth = require('./routes/auth');
const express = require('express');
const config = require('config');
const error = require('./middleware/error');
const winston = require('winston');

// Create an express application
const app = express();

// Adding the file transport to store the logs in file
winston.add(new winston.transports.File({ filename: 'logfile.log' }));

// Exit the process if the environment variable for jwtPrivateKey is not set
if(!config.get('jwtPrivateKey')) {
    console.error('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

// Connect to MongoDB database server
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...'));

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

// Run the server on port 8086 by default unless set by an environment variable
const port = process.env.PORT || 8086;
app.listen(port, () => console.log(`Listening on port ${port}...`));