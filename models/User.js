const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			validate: [validator.isEmail, "Please provide a valid email"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
			minlength: [6, "Password must be at least 6 characters"],
			select: false,
		},
		passwordResetToken: {
			type: String,
		},
		passwordResetExpires: Date,
		active: {
			type: Boolean,
			default: true,
			select: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("USER", UserSchema);
