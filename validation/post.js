const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validatePostFields(data){
    
    let errors = {};
    data.text=!isEmpty(data.text)?data.text:'';

    if(!Validator.isLength(data.text, { min:2, max: 200 })){
        errors.text = 'Post should be between 2 and 200 characters';
    }

    if(Validator.isEmpty(data.text)){
        errors.text = 'Post should not be empty';
    }
    return {
        errors,
        isValid:isEmpty(errors)
    }
}