const genres = require('./routes/genres');
const express = require('express');
const app = express();

//For parsing request body - middleware
app.use(express.json());

//Genre related router - middleware
app.use('/api/genres', genres);

console.log('Listening to port 8086...')
app.listen(8086);
