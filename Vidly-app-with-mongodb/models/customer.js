const mongoose = require('mongoose');
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

// Function to validate the request body against the customer schema
function validateCustomer(customer) {
    const schema = {
      name: Joi.string().min(5).required(),
      phone: Joi.string().min(5).max(50).required(),
      isGold: Joi.boolean()
    };
  
    return Joi.validate(customer, schema);
}
  
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;