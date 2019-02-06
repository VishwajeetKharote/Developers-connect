const Validator = require('validator');
const isEmpty = require('./is-Empty');

module.exports = function validateProfileInput(data){
    let errors = {};
    
    data.handle = !isEmpty(data.handle)?data.handle:'';
    data.skills = !isEmpty(data.skills)?data.skills:'';
    data.status = !isEmpty(data.status)?data.status:'';
    data.linkedin = !isEmpty(data.linkedin)?data.linkedin:'';
    data.facebook = !isEmpty(data.facebook)?data.facebook:'';
    data.github = !isEmpty(data.github)?data.github:'';
    data.website = !isEmpty(data.website)?data.website:'';
    
    // Handle field validation
    if(!Validator.isLength(data.handle,{min:2,max:20})){
        errors.handle = 'Handle must be between 2 and 20 characters';
    }
    if(Validator.isEmpty(data.handle)){
        errors.handle = 'Handle is mandatory';
    }

    // skills and status field validation
    if(Validator.isEmpty(data.skills)){
        errors.skills = 'Skills are mandatory';
    }

    if(Validator.isEmpty(data.status)){
        errors.status = 'Status is mandatory';
    }

    // Social media links validation

    if(!Validator.isEmpty(data.linkedin)){
        if(!Validator.isURL(data.linkedin)){
            errors.linkedin = 'LinkedIn URL is not valid';
        }
    }

    if(!Validator.isEmpty(data.facebook)){
        if(!Validator.isURL(data.facebook)){
            errors.facebook = 'Facebook URL is not valid';
        }
    }

    if(!Validator.isEmpty(data.github)){
        if(!Validator.isURL(data.github)){
            errors.github = 'Github URL is not valid';
        }
    }

    if(!Validator.isEmpty(data.website)){
        if(!Validator.isURL(data.website)){
            errors.website = 'Website URL is not valid';
        }
    }

    return {
        errors,
        isValid:isEmpty(errors)
    }

}