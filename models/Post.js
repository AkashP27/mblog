const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: [true, "Post must have title"],
		},
		desc: {
			type: String,
			required: [true, "Post must have description"],
		},
		imageURL: {
			type: String,
		},
		cloudinary_id: {
			type: String,
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "USER",
			required: [true, "Post must have author"],
		},
	},
	{ timestamps: true }
);

PostSchema.index({ title: -1 });

module.exports = mongoose.model("POST", PostSchema);
