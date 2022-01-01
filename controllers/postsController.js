const Post = require("../models/Post");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const path = require("path");

// const fs = require("fs");

exports.postForm =
 (upload.single("image"),
 async (req, res) => {
  try {
   const result = await cloudinary.uploader.upload(req.file.path);
   // console.log(req.file.path);
   const newPost = new Post({
    name: req.body.name,
    title: req.body.title,
    desc: req.body.desc,
    imageURL: result.secure_url,
    cloudinary_id: result.public_id,
   });

   try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
   } catch (err) {
    res.status(500).json(err);
   }
  } catch (err) {
   console.log(err);
  }
 });

exports.getForm = async (req, res) => {
 try {
  const post = await Post.find().sort({ _id: -1 });
  // const post = await Post.find().populate("uploadedBy");
  // console.log(post);
  res.status(200).json(post);
 } catch (err) {
  res.status(500).json(err);
 }
};

exports.updateForm = async (req, res) => {
 try {
  const post = await Post.findById(req.params.id);
  if (post.name === req.body.name) {
   try {
    const updatedPost = await Post.findByIdAndUpdate(
     req.params.id,
     {
      $set: req.body,
     },
     { new: true }
    );
    res.status(200).json(updatedPost);
   } catch (error) {
    res.status(500).json(error);
   }
  } else {
   res.status(401).json("you can update only your post");
  }
 } catch (err) {
  res.status(500).json(err);
 }
};

exports.deleteForm = async (req, res) => {
 try {
  const post = await Post.findById(req.params.id);
  if (post.name === req.body.name) {
   try {
    await cloudinary.uploader.destroy(post.cloudinary_id);
    await post.delete();
    res.status(200).json("Post has been deleted");
   } catch (error) {
    res.status(500).json(error);
   }
  } else {
   res.status(401).json("you can delete only your post");
  }
 } catch (err) {
  res.status(500).json(err);
 }
};

exports.getForm = async (req, res) => {
 try {
  // const post = await Post.findById(req.params.id).populate("uploadedBy");
  const post = await Post.findById(req.params.id);

  res.status(200).json(post);
 } catch (err) {
  res.status(500).json(err);
 }
};
