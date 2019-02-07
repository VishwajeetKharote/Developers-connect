const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');

//load validation functions
const ValidateProfileFields = require('../../validation/profile');
const ValidateEducationFields = require('../../validation/education');
const ValidateExperienceFields = require('../../validation/experience');

// load neccessary models
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route GET /api/profile/
// @desc Get current users profile
// @access private
router.get('/', passport.authenticate('jwt',{session:false}), (req,res)=>{
    let errors = {};

    Profile.findOne({user:req.user.id})
        .populate('users', ['name', 'avatar'])
        .then(profile=>{
            if(!profile){
                errors.noprofile = 'Profile does not exist';
                return res.status(404).json(errors);
            }
            res.send(profile);
        })
        .catch(err=>console.log(err))

});

// @route GET /api/profile/all
// @desc Get all profile
// @access public
router.get('/all',(req,res)=>{
    let errors = {};
    Profile.find()
    .populate('users',['name','avatar'])
    .then(profiles =>{
        if(!profiles){
            errors.noprofiles = 'No profiles currently'
            return res.status(404).json(errors);
        }
        res.json(errors);
    }).catch(err=>res.status(400).json(err))
});

// @route GET /api/profile/handle/:handle
// @desc Get user profile by handle
// @access private
router.get('/handle/:handle', passport.authenticate('jwt', {session:false}), (req,res)=>{
    let errors = {};
    Profile.findOne({handle:req.params.handle})
        .populate('users', ['name', 'avatar'])
        .then(profile=>{
            if(profile){
                res.status(200).send(profile)
            }
            else{
                errors.noprofile = 'Profile does not exist';
                return res.status(404).send(errors);
            }
        })
        .catch(err=>res.status(400).json(err))

});

// @route GET /api/profile/user/:user_id
// @desc Get user profile by handle
// @access private
router.get('/user/:user_id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    let errors = {};
    Profile.findOne({user_id:req.params.user_id})
        .populate('users', ['name', 'avatar'])
        .then(profile=>{
            if(profile){
                res.status(200).send(profile)
            }
            else{
                errors.noprofile = 'Profile does not exist';
                return res.status(404).send(errors);
            }
        })
        .catch(err=>res.status(400).json(err))

});

// @route POST /api/profile/
// @desc Create or update profile
// @access private
router.post('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const fields = {};
    const {errors, isValid} = ValidateProfileFields(req.body);
    if(!isValid){
        return res.status(400).send(errors);
    }
    //console.log(req.user.id);
    fields.user = req.user.id;
    if(req.body.handle) fields.handle = req.body.handle;
    if(req.body.company) fields.company = req.body.company;
    if(req.body.location) fields.location = req.body.location;
    if(req.body.website) fields.website = req.body.website;
    if(req.body.status) fields.status = req.body.status;
    // adding skills to array
    if(typeof req.body.skills !== 'undefined') fields.skills = req.body.skills.split(',');
    if(req.body.bio) fields.bio = req.body.bio;
    if(req.body.githubusername) fields.githubusername = req.body.githubusername;
    //adding social network links
    fields.social = {};
    if(req.body.linkedin) fields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) fields.social.facebook = req.body.facebook;
    if(req.body.github) fields.social.github = req.body.github;
    console.log(fields);

    Profile.findOne({user:req.user.id})
            .then(profile=>{
                if(profile)
                {
                    // update the profile
                    Profile.findOneAndUpdate({user:req.user.id},{$set:fields},{new:true})
                        .then(profile=>res.json(profile))
                }
                else{
                    // create new profile
                    Profile.findOne({handle:fields.handle})
                    .then(profile=>{
                        if(profile) {
                            errors.handle = 'This handle already exists';
                            res.status(400).json(errors);
                        }
                        else{
                            const newProfile = new Profile(fields);
                           newProfile.save()
                                    .then(profile=>res.json(profile))
                                    .catch(err=>console.log(err))
                        }
                    })
                }
            })
            .catch(err=>console.log(err))
    
    
});

// @route POST /api/profile/education
// @desc Create or update education
// @access private
router.post('/education',passport.authenticate('jwt', {session:false}),(req,res)=>{
    
    const {errors, isValid} = ValidateEducationFields(req.body);
    if(!isValid){
        return res.status(400).send(errors);
    }
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                let educationObj = {};
                if(req.body.school) educationObj.school = req.body.school;
                if(req.body.degree) educationObj.degree = req.body.degree;
                if(req.body.fieldofstudy) educationObj.fieldofstudy = req.body.fieldofstudy;
                if(req.body.from) educationObj.from = req.body.from;
                if(req.body.to) educationObj.to = req.body.to;
                if(req.body.current) educationObj.current = req.body.current;
                if(req.body.decription) educationObj.description = req.body.description;

                // add the education
                profile.education.unshift(educationObj);
                profile.save().then(profile=>{
                    res.send(profile)
                }).catch(err=>console.log(err))
            }
            else{
                errors.noprofile = 'Profile not valid';
                return res.status(404).json(errors);
            }
        })
});

// @route POST /api/profile/experience
// @desc Create or update experience
// @access private
router.post('/experience', passport.authenticate('jwt', {session:false}),(req,res)=>{

    const {errors, isValid} = ValidateExperienceFields(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(profile){
                let experienceObj = {};
                if(req.body.title) experienceObj.title = req.body.title;
                if(req.body.company) experienceObj.company = req.body.company;
                if(req.body.location) experienceObj.location = req.body.location;
                if(req.body.from) experienceObj.from = req.body.from;
                if(req.body.to) experienceObj.to = req.body.to;
                if(req.body.current) experienceObj.current = req.body.current;
                if(req.body.description) experienceObj.description = req.body.description;

                // add experience to profile
                profile.experience.unshift(experienceObj);
                profile.save().then(profile=>{
                    res.send(profile);
                }).catch(err=>console.log(err))
            }
        }).catch(err=>console.log(err))
});

// @route  DELETE /api/profile/experience/:exp_id
// @desc   Delete an experience 
// @access private
router.delete('/experience/:exp_id', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            const removeIndex = profile.experience
                                .map(item=>item.id)
                                .indexOf(req.params.exp_id);
                        
            // REMOVE THE EXPERIENCE AT INDEX = removeIndex
            profile.experience.splice(removeIndex,1);
            profile.save().then(profile=>{
                res.send(profile)
            }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
});

// @route  DELETE /api/profile/education/:edu_id
// @desc   Delete an education 
// @access private

router.delete('/education/:edu_id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
    .then(profile=>{
        const removeIndex = profile.education 
                            .map(item=>item.id)
                            .indexOf(req.params.edu_id)

        // REMOVE THE EDUCATION AT INDEX = removeIndex
        profile.education.splice(removeIndex,1);
        profile.save()
                .then(profile=>{
                    res.send(profile);
                }).catch(err=>{console.log(err)})
    }).catch(err=>console.log(err))
});

// @route DELETE api/profile/
// @desc delete the profile
// @access private
router.delete('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            Profile.findByIdAndRemove(profile.id).then(()=>{
                res.send({success:true})
            }).catch(err=>console.log(err))
        }).catch(err=>console.log(err))
});

module.exports = router;