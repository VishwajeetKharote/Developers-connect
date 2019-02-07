const Validator = require('validator');
const isEmpty = require('./is-Empty');
const moment = require('moment');

// if current is checked add logic ---- remaining

module.exports = function validateExperienceFields(data){

    let errors = {};

    data.title = !isEmpty(data.title)?data.title:'';
    data.company = !isEmpty(data.company)?data.company:'';
    data.from = !isEmpty(data.from)?data.from:'';
    data.to = !isEmpty(data.to)?data.to:'';

    // Job title field validation
    if(!Validator.isLength(data.title, {min:2, max:20})){
        errors.title = 'Title is not valid';
    }

    if(Validator.isEmpty(data.title)){
        errors.title = 'School name of mandatory';
    }

    // Company field validation

    if(!Validator.isLength(data.company, {min:2, max:20})){
        errors.company = 'Incorrect information';
    }

    if(Validator.isEmpty(data.company)){
        errors.company = 'Company name of mandatory';
    }


    if(!Validator.isEmpty(data.from)){
        // this part need to change 
        if(!moment(data.from, "YYYY/MM/DD", true).isValid){
            data.from = 'Enter valid date';
        }
    }

    if(Validator.isEmpty(data.from)){
        errors.from = 'Start date is mandatory';
    }

    if(!Validator.isEmpty(data.to)){
        // this part need to change 
        if(moment(data.to, "YYYY/MM/DD", true).isValid && moment(data.from, "YYYY/MM/DD", true).isValid){
            if(!Validator.isAfter(data.to,data.from)){
                errors.to = 'End date must be after start date';
        }
    }
         else{
             errors.date = 'Invalid date format';
         }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}



