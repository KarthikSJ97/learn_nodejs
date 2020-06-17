const courses = require('./routes/courses');
const home = require('./routes/home');
const express = require('express');
const app = express();

//Used for parsing request body - middleware
app.use(express.json());

//Courses router - middleware
app.use('/api/courses', courses);

//Home router - middleware
app.use('/', home);

//Setting port number from environment variables, if not found use 8086
const port = process.env.PORT || 8086;
app.listen(port, () => console.log(`Listening to port ${port}...`));