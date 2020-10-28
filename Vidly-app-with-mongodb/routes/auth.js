const express = require('express');
const router = express.Router();
const {User} = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Router to authenticate a user
router.post('/', async(req, res) => {
    
    // Validate request body against custom validator
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    // Validate the user credentials
    let user = await User.findOne({ email: req.body.email});
    if(!user) return res.status(400).send('Invalid email Id or password');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email Id or password');

    // Generate Jwt token and return on successful authentication
    const token = jwt.sign({ _id: user._id}, 'jwtPrivateKey');
    res.send(token);

});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    }
    return Joi.validate(req, schema);
}


module.exports = router;