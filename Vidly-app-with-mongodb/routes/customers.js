const express = require('express');
const router = express.Router();
const { Customer, validate } = require('../models/customer');

// Route to get list of all the customers
router.get('/', async(req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

// Route to add a new customer
router.post('/', async(req, res) => {
  // Validate request body against customer schema
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer ({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  });

  try {
    await customer.save();
    res.send(customer);
  }
  catch(error) {
    res.send(error.message);
  }
  
  
});

// Route to update a customer details
router.put('/:id', async(req, res) => {
  
    // Validate request body against customer schema
    const { error } = validate(req.body); 
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

module.exports = router;
