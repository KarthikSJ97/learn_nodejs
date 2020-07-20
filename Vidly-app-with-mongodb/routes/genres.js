const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// Joi for request body validation
const Joi = require('joi');

// Generate genre schema
const genreSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    // minlength: 5,
    // maxlength: 50,

    // Custom validator for sending custom message on Bad Request
    validate: {
      validator: function(v) {
        return v.length >= 5 && v.length <=50;
      },
      message: 'Genre should be atleast 5 characters long'
    }
  }
});

// Generate model using the genre schema
const Genre = mongoose.model('Genre', genreSchema);

// Route to get list of all the genres
router.get('/', async(req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// Route to add a new genre
router.post('/', async(req, res) => {
  // Validate request body against genre schema
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre ({
    name: req.body.name
  });

  try {
    genre = await genre.save();
    res.send(genre);
  }
  catch(error) {
    res.send(error.message);
  }
  
  
});

// Route to update a genre name
router.put('/:id', async(req, res) => {
  
  // Validate request body against genre schema
  const { error } = validateGenre(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // setting the new property to true to get the genre oject after updating in the database
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Route to delete a genre
router.delete('/:id', async(req, res) => {

  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

// Route to get a genre by Id
router.get('/:id', async(req, res) => {
  
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

// Function to validate the request body against the genre schema
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(5).required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
