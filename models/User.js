const mongoose = require("mongoose");
const validator = require("validator");

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
   validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
   type: String,
   required: true,
   minlength: 6,
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
