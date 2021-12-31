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
  imageURL: {
   type: String,
   required: true,
  },
  cloudinary_id: {
   type: String,
  },
  // uploadedBy: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "USER",
  // },
 },
 { timestamps: true }
);

module.exports = mongoose.model("POST", PostSchema);
