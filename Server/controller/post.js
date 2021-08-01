const { json } = require('express');
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');

// create post
  const newPost = async (req, res) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        const user = await User.findById(req.user.id).select('-password')
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id,
            file: req.body.file

        })
        const post = await newPost.save();
        res.json(post)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// fetch all posts
  const Posts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// fetch single post
  const Post = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' })
        }
        res.json(post)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// delete post 
  const Delete = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found!' })
        }
        if (post.user.toString() !== req.user.id) {
            res.status(401).json({ msg: 'User not authorized' })
        }
        await post.remove();
        res.json({ msg: 'Post removed' })
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// like post 
  const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (post.likes.some((like) => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Post already liked!' })
        }
        post.likes.unshift({ user: req.user.id })
        await post.save();
        return res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// unlike post 
  const unLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post.likes.some(() => like.user.toString() === req.user.id)) {
            return res.status(400).json({ msg: 'Post has not been liked!!' })
        }

        post.likes = post.likes.filter(
            ({ user
            }) => user.toString() !== req.user.id
        )

        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
// comment on post 
  const postOnComment = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    try {
        const user = await (await User.findById(req.params.id)).select('-password')
        const post = await Post.findById(req.params.id)

        const newComment = new Post({
            text: req.body.text,
            name: req.user.name,
            avatar: req.user.avatar,
            user: req.user.id
        })

        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

}
// delete comment on post 
  const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        const comment = post.comments.find(
            (comment) => comment.id == req.params.comment_id
        )

        if (!comment) return res.status(404).json({ msg: 'Comment does not exist' })

        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not autherized' })
        }

        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id
        )

        await post.save()
        return res.json(post.comments)

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}



exports.post = newPost
exports.post = Posts
exports.post = Post
exports.post = Delete
exports.post = likePost
exports.post = unLikePost
exports.post = postOnComment
exports.post = deleteComment
