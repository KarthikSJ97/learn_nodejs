const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {User, validate} = require('../models/user');

// Router to register a new user to our application
router.post('/', async(req, res) => {
    
    // Validate request body against genre schema
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    // Check if the user already exists with the email Id being the unique property
    let user = await User.findOne({ email: req.body.email});
    if(user) return res.status(400).send('User already exists');

    // A malicious user may send multiple properties, hence we just pick the properties that are required
    user = new User (_.pick(req.body, ['name', 'email', 'password']));

    try{
        await user.save();
        res.send(_.pick(user, ['_id', 'name', 'email']));
    }
    catch(error) {
        res.send(error.message);
    }

});


module.exports = router;