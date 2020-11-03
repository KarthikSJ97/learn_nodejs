const express = require('express');
const winston = require('winston');

// Create an express application
const app = express();

// Loading this module first to catch and log any exception that occurs in the following modules
require('./startup/logging')();

// Load the /startup/routes.js module and call the function by passing the reference to app
require('./startup/routes')(app);

// Load the /startup/db.js module and call the function to connect to mongodb server
require('./startup/db')();

// Load the configuration
require('./startup/config')();

// Load Joi validation
require('./startup/validation')();

// Load the middlewares for prod environment by passing the express application object
require('./startup/prod')(app);

// Run the server on port 8086 by default unless set by an environment variable
const port = process.env.PORT || 8086;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

module.exports = server;