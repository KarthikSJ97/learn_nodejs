const express = require('express');
const { Genre } = require('../models/genre');
const router = express.Router();
const {Movie, validateMovie} = require('../models/movie');

// Route to get the list of all the movies
router.get('/', async(req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

// Router to add a new movie to the collection
router.post('/', async(req, res) => {

    const {error} = validateMovie(req.body);
    // console.log(error);
    if(error) res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if(!genre) res.status(400).send('Invalid Genre Id');

    const movieObject = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    });

    try {
        await movieObject.save();
        res.send(movieObject);
    }
    catch(error) {
        res.send(error.message);
    }
});

// Router to update the movie details
router.put('/:id', async(req, res) => {

    // Check if the movie Id is valid
    let movie = await Movie.findById(req.params.id);
    if(!movie) res.status(400).send(`Invalid movie ID ${req.params.id}`);
    console.log(movie);

    // Validate the request body with the movie schema
    const {error} = validateMovie(req.body);
    if(error) res.status(400).send(error.details[0].message);

    // Validate the genre Id
    const genre = await Genre.findById(req.body.genreId);
    if(!genre) res.status(400).send(`Invalid genre ID ${req.body.genreId}`);

    // Update the values
    movie.title = req.body.title;
    movie.genre._id = req.body.genreId;
    movie.genre.name = genre.name;
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;

    try {
        movie = await movie.save();
        res.send(movie);
    }
    catch(error) {
        res.send(error.message);
    }

});

// Router to delete a movie from the collection
router.delete('/:id', async(req, res) => {

    // Check if the movie exists
    const movie = await Movie.findById(req.params.id);
    if(!movie) res.status(404).send(`The movie with Id ${req.params.id} does not exist`);

    try {
        await Movie.deleteOne({_id: req.params.id});
        res.status(204).send('Movie successfully deleted');
    }
    catch(error) {
        res.send(error.message);
    }
});

// Router to get a movie document by Id
router.get('/:id', async(req, res) => {

    const movie = await Movie.findById(req.params.id);
    if(!movie) res.status(404).send(`The movie with Id ${req.params.id} does not exist`);
    res.send(movie);
});


module.exports = router;