const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const ValidateProfileFields = require('../../validation/profile');
// load neccessary models
const User = require('../../models/User');
const Profile = require('../../models/Profile');



router.get('/', passport.authenticate('jwt',{session:false}), (req,res)=>{
    let errors = {};

    Profile.findOne({user:req.user.id})
        .then(profile=>{
            if(!profile){
                errors.noprofile = 'Profile does not exist';
                return res.status(404).json(errors);
            }
            res.send(profile);
        })
        .catch(err=>console.log(err))

});

router.post('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    const fields = {};
    const {errors, isValid} = ValidateProfileFields(req.body);
    if(!isValid){
        return res.status(400).send(errors);
    }
   console.log(req.user.id);
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

module.exports = router;