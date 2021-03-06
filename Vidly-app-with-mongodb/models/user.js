const mongoose = require('mongoose');
// Joi for request body validation
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

// Generate genre schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
  return token;
}

// Generate model using the genre schema
const User = mongoose.model('User', userSchema);

// Function to validate the request body against the genre schema
function validateUser(user) {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;
module.exports.userSchema = userSchema;