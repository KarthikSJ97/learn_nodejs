const mongoose = require('mongoose');
const genres = require('./routes/genres');
const express = require('express');

// Create an express application
const app = express();

// Connect to MongoDB database server
mongoose.connect('mongodb://localhost/vidly')
    .then(() => console.log('Connected to MongoDB...'))
    .catch((err) => console.log('Could not connect to MongoDB...'));

// Middleware which only processes requests having Content-Type as application/json
app.use(express.json());
// Middleware for routing purpose
app.use('/api/genres', genres);

// Run the server on port 8086 by default unless set by an environment variable
const port = process.env.PORT || 8086;
app.listen(port, () => console.log(`Listening on port ${port}...`));