const Validator = require('validator');
const isEmpty = require('./is-Empty');


module.exports = function validateRegisterInput(data){
    let errors = {};
    // console.log('Inside validate register input');
    // console.log(data);
    data.name = !isEmpty(data.name)?data.name:'';
    data.email = !isEmpty(data.email)?data.email:'';
    data.password = !isEmpty(data.password)?data.password:''; 
    data.password2 = !isEmpty(data.password2)?data.password2:'';
    // console.log(data);
    // Name field validation
    

    if(!Validator.isLength(data.name, { min:2, max:20 })){
        errors.name = 'Name must be between 2 and 40';
    }

    if(Validator.isEmpty(data.name)){
        errors.name = 'Name is mandatory';
    }

    // email field validation
    

    if(!Validator.isEmail(data.email)){
        errors.email = 'Email is not valid';
    }

    if(Validator.isEmpty(data.email)){
        errors.email = 'Email is mandatory';
    }

    // password field validation
    
    if(!Validator.equals(data.password, data.password2)){
        console.log('Inside password match');
        errors.password = 'Passwords do not match';
    }

    if(Validator.isEmpty(data.password)){
        errors.password = 'Password is mandatory';
    }
    return {
        errors,
        isValid: isEmpty(errors)
    }
}



