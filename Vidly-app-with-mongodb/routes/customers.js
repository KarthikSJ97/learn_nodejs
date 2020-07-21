const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
// Joi for request body validation
const Joi = require('joi');

// Generate customer schema
const customerSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true,
    // Custom validator for sending custom message on Bad Request
    validate: {
      validator: function(v) {
        return v.length >= 5 && v.length <=50;
      },
      message: 'Customer name should be atleast 5 characters long'
    }
  },
  phone : {
    type: String,
    required: true,
    // Custom validator for sending custom message on Bad Request
    validate: {
      validator: function(v) {
        return v.length >= 5 && v.length <=50;
      },
      message: 'Phone number should be atleast 5 characters long'
    }
  },
  isGold : {
      type: Boolean,
      default: false
  }
});

// Generate model using the customer schema
const Customer = mongoose.model('Customer', customerSchema);

// Route to get list of all the customers
router.get('/', async(req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// Route to add a new customer
router.post('/', async(req, res) => {
  // Validate request body against customer schema
  const { error } = validateCustomer(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer ({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  try {
    customer = await customer.save();
    res.send(customer);
  }
  catch(error) {
    res.send(error.message);
  }
  
  
});

// Route to update a customer details
router.put('/:id', async(req, res) => {
  
    // Validate request body against customer schema
    const { error } = validateCustomer(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    // setting the new property to true to get the genre oject after updating in the database
    const customer = await Customer.findByIdAndUpdate(
        req.params.id, 
        { 
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        },
        { new: true }
    );
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
});
  
// Route to delete a customer
router.delete('/:id', async(req, res) => {
  
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
    res.send(customer);
});
  
// Route to get a customer by Id
router.get('/:id', async(req, res) => {
    
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send('The customer with the given ID was not found.');
    res.send(customer);
});


// Function to validate the request body against the customer schema
function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
  }
  
  module.exports = router;