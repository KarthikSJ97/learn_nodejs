const express = require('express');
const router = express.Router();
const {Genre, validate} = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// Route to get list of all the genres
router.get('/', async(req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// Route to add a new genre
// Added an optional middleware auth to this route
router.post('/', auth, async(req, res) => {
  // Validate request body against genre schema
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre ({
    name: req.body.name
  });
  await genre.save();
  res.send(genre);
    
});

// Route to update a genre name
router.put('/:id', async(req, res) => {
  
  // Validate request body against genre schema
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // setting the new property to true to get the genre oject after updating in the database
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Route to delete a genre
// Pass through an array of middlewares
// To authenticate the user and check for the role of admin
router.delete('/:id', [auth, admin], async(req, res) => {

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Route to get a genre by Id
router.get('/:id', validateObjectId, async(req, res) => {

  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

module.exports = router;
