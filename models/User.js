const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
 {
  name: {
   type: String,
   required: true,
   unique: true,
  },
  email: {
   type: String,
   required: true,
  },
  password: {
   type: String,
   required: true,
  },
  // posts: { type: mongoose.Schema.Types.ObjectId, ref: "POST" },
 },
 { timestamps: true }
);

// UserSchema.virtual("posts", {
//   ref: "POST",
//   foreignField: "name",
//   localField: "_id",
// });

module.exports = mongoose.model("USER", UserSchema);
