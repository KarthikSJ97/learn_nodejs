const mongoose = require('mongoose');
const winston = require('winston');

module.exports = function() {
    
    // Connect to MongoDB database server
    mongoose.connect('mongodb://localhost/vidly')
        .then(() => winston.info('Connected to MongoDB...'));
}