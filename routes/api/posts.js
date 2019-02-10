const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validatePostFields = require('../../validation/post');
const passport = require('passport');
// Loading User and Profile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');


router.post('/', passport.authenticate('jwt',{session:false}),(req,res)=>{
    const { errors, isValid } = validatePostFields(req.body);
    if(!isValid){
        return res.status(200).send(errors);
    }
    post = new Post({
        user:req.user.id,
        text:req.body.text,
        name:req.body.name,
        avatar:req.body.avatar
    });
    post.save(post)
        .then(post=>{
            res.status(200).json(post);
        })
        .catch(err=>console.log(err))
});

router.get('/',(req,res)=>{
    Post.find()
        .sort({date: -1})
        .then(post=>{
            res.status(200).json(post)
        })
        .catch(err=>res.status(404).json({postsnotfound: 'No posts found'}))
});

router.get('/:id', passport.authenticate('jwt', {session:false}), (req,res)=>{
    Post.findById(req.params.id)
        .then(post=>{
            res.status(200).json(post);
        })
        .catch(err=>res.status(404).json({postnotfound:'No post found'}))
});

router.delete('/:id', passport.authenticate('jwt',{session:false}),(req,res)=>{
    Profile.findOne({user:req.user.id})
        .then(profile=>{
            Post.findById(req.params.id)
                .then(post=>{  
                    console.log(typeof(post.user));
                    if(post.user.toString() !== req.user.id){   // this step is important
                        return res.status(401).json({unauthorized: 'Not authorized'});
                    }
                    post.remove().then(()=>{res.status(200).json({success:true})})
                }).catch(err=> res.send(401).json({nopostfound:'No post found'}))
        })
        .catch(err=>{
            res.status(404).json({noprofilefound:'noprofilefound'})
        })
});

module.exports = router;