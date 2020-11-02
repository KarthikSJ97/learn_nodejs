const mongoose = require('mongoose');
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

// Function to validate the request body against the genre schema
function validateGenre(genre) {
    const schema = {
      name: Joi.string().min(5).max(50).required()
    };
  
    return Joi.validate(genre, schema);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.genreSchema = genreSchema;