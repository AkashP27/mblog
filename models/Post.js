const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
    // uploadedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "USER",
    // },
  },
  { timestamps: true }
);

module.exports = mongoose.model("POST", PostSchema);

// const Post = new mongoose.model("POST", PostSchema);

// module.exports = Post;
