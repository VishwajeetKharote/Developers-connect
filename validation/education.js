const Validator = require('validator');
const isEmpty = require('./is-Empty');
const moment = require('moment');


// if current is checked add logic ---- remaining

module.exports = function validateEducationFields(data){

    let errors = {};

    data.school = !isEmpty(data.school)?data.school:'';
    data.degree = !isEmpty(data.degree)?data.degree:'';
    data.fieldofstudy = !isEmpty(data.fieldofstudy)?data.fieldofstudy:'';
    data.from = !isEmpty(data.from)?data.from:'';
    data.to = !isEmpty(data.to)?data.to:'';

    // school field validation
    if(!Validator.isLength(data.school, {min:2, max:20})){
        errors.school = 'School name not valid';
    }

    if(Validator.isEmpty(data.school)){
        errors.school = 'School name of mandatory';
    }

    // degree field validation

    if(!Validator.isLength(data.degree, {min:2, max:20})){
        errors.degree = 'Degree name not valid';
    }

    if(Validator.isEmpty(data.degree)){
        errors.degree = 'Degree name of mandatory';
    }

    //fieldofstudy fields validation

    if(!Validator.isLength(data.fieldofstudy, {min:2, max:20})){
        errors.fieldofstudy = 'Degree name not valid';
    }

    if(Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'Degree name of mandatory';
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



