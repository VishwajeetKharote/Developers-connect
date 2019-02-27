const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const validatePostFields = require('../../validation/post');
const passport = require('passport');
// Loading User and Profile models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// @route POST/api/posts/
// @desc create a new post
// @access PRIVATE
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostFields(req.body);
    if (!isValid) {
      return res.status(200).send(errors);
    }
    post = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar
    });

    post
      .save(post)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => console.log(err));
  }
);

// @route GET /api/posts/
// @desc get all the posts
// @access PUBLIC
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => res.status(404).json({ postsnotfound: 'No posts found' }));
});

// @route GET /api/posts/:id
// @desc get a post by using id
// @access PRIVATE
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route DELETE /api/posts/:id
// @desc delete a post by id
// @access PRIVATE
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        Post.findById(req.params.id)
          .then(post => {
            //console.log(typeof(post.user));
            if (post.user.toString() !== req.user.id) {
              // this step is important
              return res.status(401).json({ unauthorized: 'Not authorized' });
            }
            post.remove().then(() => {
              res.status(200).json({ success: true });
            });
          })
          .catch(err => res.send(401).json({ nopostfound: 'No post found' }));
      })
      .catch(err => {
        res.status(404).json({ noprofilefound: 'noprofilefound' });
      });
  }
);

// @route POST /api/posts/like/:id
// @desc like a post
// @access PRIVATE
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          console.log(post.likes);
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res.json({
              alreadyliked: 'You have already liked this post'
            });
          }
          console.log('This is getting printed');
          post.likes.unshift({ user: req.user.id });
          console.log(post.likes);
          post.save().then(post => {
            res.send(post);
          });
        })
        .catch(err => res.status(404).json({ postnotfound: 'Post not found' }));
    });
  }
);

// @route POST /api/posts/dislike/:id
// @desc dislike already liked post
// @access PRIVATE
router.post(
  '/dislike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res.json({ postnotliked: 'You have not liked this post' });
          }
          const removeIndex = post.likes
            .map(user => user.id)
            .indexOf(req.user.id);
          post.likes.splice(removeIndex, 1);
          post.save().then(post => {
            res.send(post);
          });
        })
        .catch(err =>
          res.status(404).json({ postsnotfound: 'Posts not found' })
        );
    });
  }
);

// @route POST /api/posts/comments/:id
// @desc comment on a post
// @access PRIVATE
router.post(
  '/comments/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostFields(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const commentObj = {
          user: req.user.id,
          name: req.body.name,
          text: req.body.text,
          avatar: req.body.avatar
        };
        post.comments.unshift(commentObj);
        post.save().then(post => res.send(post));
      })
      .catch(err => res.status(404).json({ postnotfound: 'post not found' }));
  }
);

// @route /api/posts/comments/:id/:comment_id
// @desc delete a comment for a post
// @access PRIVATE
router.post(
  '/comments/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        if (
          !post.comments.filter(
            comment => comment.user.toString() === req.user.id
          ).length > 0
        ) {
          return res
            .status(400)
            .json({ nocommentfound: 'You have not commented on this post' });
        }
        const removeIndex = post.comments
          .map(comment => comment.id)
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.send(post));
      })
      .catch(err => res.status(404).json({ postsnotfound: 'Post not found' }));
  }
);

module.exports = router;
