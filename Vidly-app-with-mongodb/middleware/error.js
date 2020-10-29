const winston = require('winston');

module.exports = function(error, req, res, next) {

    winston.error(error.message, error);
    res.status(500).send('Something failed');
}