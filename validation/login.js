const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateLoginInput(data){

    let errors = {};

    data.email = !isEmpty(data.email)?data.email:'';
    data.password = !isEmpty(data.password)?data.password:'';

    // Email field validation
    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is not valid';
    }

    if(Validator.isEmpty(data.email)){
        errors.email = 'Email is mandatory';
    }

    // Password field validation
    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is mandatory';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }

};