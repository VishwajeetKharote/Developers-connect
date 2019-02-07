const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const User = require('../../models/User');
const jwtKey = require('../../config/keys').secretOrPrivateKey;

// Importing Validation functions
const ValidateRegisterInput = require('../../validation/register');
const ValidateLoginInput = require('../../validation/login');
const Profile = require('../../models/Profile');

// @route GET/api/users/test
// @desc testing route
// @access public 

router.get('/test', (req,res)=>{
    console.log('this is working');
    res.send({msg:'This is test route'});
});

// @route POST/api/users/register
// @desc register a new user
// @access public
router.post('/register', (req,res)=>{
    const {errors, isValid } = ValidateRegisterInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email:req.body.email})
        .then(user=>{
            if(user){
                errors.email = 'user already exists';
                return res.status(400).json({errors});
            }
            else{
                const avatar = gravatar.url(req.body.email, {
                    s:'200',
                    r:'pg',
                    d:'mm'
                });

                const newUser = new User({
                    name:req.body.name,
                    email:req.body.email,
                    password:req.body.password,
                    avatar
                });
                // newUser.save()
                //     .then(user=>res.send(user))
                //     .catch(err=>console.log(err))

                bycrypt.genSalt(10, (err,salt)=>{
                    bycrypt.hash(newUser.password, salt, (err,hash)=>{
                        if(err)throw err;
                        
                        newUser.password = hash;
                        newUser.save()
                                .then(user=>res.send(user))
                                .catch(err=>console.log(err))
                        
                    });
                });
            }
        })
});

// @route GET/api/users/login
// @desc Return JWT token after successful login 
// @access public
router.get('/login',(req,res)=>{

    const {errors, isValid} = ValidateLoginInput(req.body);
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                errors.email = 'Account does not exist';
                return res.status(400).json(errors);
            }
            bycrypt.compare(req.body.password, user.password)
                .then(isMatch=>{
                    if(isMatch){
                        // generate JWT token
                        const payload = {id:user._id,name: user.name, email:user.email, avatar:user.avatar};
                        jwt.sign(payload, jwtKey, {expiresIn: 3600}, (err,token)=>{
                            res.json({
                                success: true,
                                token : 'Bearer '+token
                            });
                        });
                    }
                    else{
                        //console.log(isMatch);
                        errors.password = 'Incorrect login credentials'
                        return res.status(400).json(errors);
                    }
                })
        })
});

// @route GET/api/users/current
// @desc Get current logged in user
// @access private
router.get('/current', passport.authenticate('jwt', {session:false}), (req,res)=>{
    res.send(req.user);
});

// @route DELETE api/users/
// @desc delete the user 
// @access private
router.delete('/', passport.authenticate('jwt', {session:false}),(req,res)=>{
    User.findOne({_id:req.user.id})
        .then(user=>{
            // get the profile if exists
            Profile.findOne({user:user.id}).then(
                profile=>{
                    if(profile){
                        Profile.findByIdAndRemove(profile.id).then(()=>{
                            console.log('success')
                        })
                    }
                }
            ).catch(err=>console.log(err));
            User.findByIdAndDelete(user.id).then(()=>{
                res.send({msg:'Deleted the profile'})
            }).catch(err=>console.log(err))

        }).catch(err=>console.log(err))
});


 module.exports = router;