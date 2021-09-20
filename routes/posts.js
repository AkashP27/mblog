const router = require("express").Router();
const Post = require("../models/Post");

// CREATE

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//   UPDATE
router.put("/:id", async (req, res) => {
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
});

//  DELETE
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.name === req.body.name) {
      try {
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
});

//  GET
router.get("/:id", async (req, res) => {
  try {
    // const post = await Post.findById(req.params.id).populate("uploadedBy");
    const post = await Post.findById(req.params.id);

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//  GET ALL POSTS
router.get("/", async (req, res) => {
  try {
    const post = await Post.find().sort({ _id: -1 });
    // const post = await Post.find().populate("uploadedBy");
    // console.log(post);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
