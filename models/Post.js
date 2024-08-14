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
		category: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return Array.isArray(v) && v.length > 0;
				},
				message: "Post must have at least one category",
			},
		},
		author: {
			type: String,
			required: [true, "Post must have Author"],
		},
		imageURL: {
			type: String,
			required: true,
		},
		cloudinary_id: {
			type: String,
		},
		uploadedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "USER",
		},
		featured: {
			type: Boolean,
		},
	},
	{ timestamps: true }
);

PostSchema.index({ title: -1 });

module.exports = mongoose.model("POST", PostSchema);
