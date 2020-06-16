const Joi = require('joi');
const express = require('express');
const app = express();

//For parsing request body
app.use(express.json());

//List of movie genres
const genres = [
    { id: 1, genre: 'Action' },
    { id: 2, genre: 'Comedy' },
    { id: 3, genre: 'Romance' },
    { id: 4, genre: 'Sci-Fi' },
    { id: 5, genre: 'Horror' },
    { id: 6, genre: 'Adventure' },
    { id: 7, genre: 'Animation' },
    { id: 8, genre: 'Thriller' }
];

//Display all genres
app.get('/api/genres', (req, res) => {
    res.send(genres);
});

//Add a new movie genre
app.post('/api/genres', (req, res) => {

    //Validate genre
    var { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //create a new genre object
    const genreObject = {
        id: genres.length + 1,
        genre: req.body.genre
    };

    //Add the genre only if it does not include
    var contains = false;
    for(var genre of genres) 
        if(genre.genre === genreObject.genre) contains = true;
    if(contains) return res.status(409).send(`Genre ${req.body.genre} already exists`);
    genres.push(genreObject);
    return res.status(201).send(genreObject);

});

//Updating a movie genre
app.put('/api/genres/:id', (req, res) => {

    let genre = genres.find(genreObject => genreObject.id === parseInt(req.params.id));
    if(!genre) return res.status(400).send('Invalid genre id');

    //Object destructuring
    const { error } = validateGenre(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    //Update the genre with the id passed as a param
    genre.genre = req.body.genre;
    return res.send(genre);
});

//Delete a movie genre
app.delete('/api/genres/:id', (req, res) => {

    let genre = genres.find(genreObject => genreObject.id === parseInt(req.params.id));
    if(!genre) return res.status(400).send('Invalid genre id');

    const genreIndex = genres.indexOf(genre);
    genres.splice(genreIndex, 1);
    res.status(204);
    res.end();
});

//Validate the new genre
function validateGenre(newGenre) {
    const schema = {
        genre: Joi.string().min(3).required()
    };
    return Joi.validate(newGenre, schema);
}


console.log('Listening to port 8086...')
app.listen(8086);
