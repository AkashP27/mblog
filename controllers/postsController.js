const Post = require("../models/Post");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("../utils/cloudinary");

const unEscape = (htmlStr) => {
	htmlStr = htmlStr.replace(/&lt;/g, "<");
	htmlStr = htmlStr.replace(/&gt;/g, ">");
	htmlStr = htmlStr.replace(/&quot;/g, '"');
	htmlStr = htmlStr.replace(/&#39;/g, "'");
	htmlStr = htmlStr.replace(/&amp;/g, "&");
	return htmlStr;
};

exports.createPost = catchAsync(async (req, res, next) => {
	if (!req.file) {
		return next(new AppError(`Please upload a file`, 500));
	}
	// console.log(req.file);

	const result = await cloudinary.uploader.upload(req.file.path);
	const newPost = new Post({
		title: req.body.title,
		desc: req.body.desc,
		imageURL: result.secure_url,
		cloudinary_id: result.public_id,
		uploadedBy: req.body.uploadedBy,
	});

	const savedPost = await newPost.save();
	res.status(201).json({
		status: "success",
		data: {
			post: savedPost,
		},
	});
});

exports.getAllPost = catchAsync(async (req, res, next) => {
	const search = req.query.title || "";
	const query = {
		title: {
			$regex: search,
			$options: "i",
		},
	};

	const posts = await Post.find(query).sort("-createdAt");
	// const posts = await Post.find(query).sort({ _id: -1 }).explain();

	if (!posts) {
		return next(new AppError("No posts found", 404));
	}

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
		},
	});
});

exports.getSinglePost = catchAsync(async (req, res, next) => {
	// const post = await Post.findById(req.params.id).populate("uploadedBy");
	const post = await Post.findById(req.params.id).populate({
		path: "uploadedBy",
		select: "-__v -createdAt -updatedAt",
	});
	if (!post) {
		return next(new AppError("No post found with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			post,
		},
	});
});

exports.updatePost = catchAsync(async (req, res, next) => {
	// console.log(req.body.desc);

	let unEscapedStr = unEscape(req.body.desc);
	// console.log(unEscapedStr);

	const post = await Post.findById(req.params.id).populate({
		path: "uploadedBy",
		select: "-__v -createdAt -updatedAt",
	});

	if (!post) {
		return next(new AppError("No post found for this id", 404));
	}

	if (post.uploadedBy.name !== req.user.name) {
		return next(new AppError("You can update only your post", 405));
	}

	const updatedPost = await Post.findByIdAndUpdate(
		req.params.id,
		{
			$set: { title: req.body.title, desc: unEscapedStr },
			// $set: { desc: unEscapedStr },
		},
		{ new: true }
	);
	res.status(200).json({
		status: "success",
		data: {
			updatedPost,
		},
	});
});

exports.deletePost = catchAsync(async (req, res, next) => {
	// console.log(req.user.name);
	const post = await Post.findById(req.params.id).populate({
		path: "uploadedBy",
		select: "-__v -createdAt -updatedAt",
	});

	if (!post) {
		return next(new AppError("No post found for this id", 404));
	}

	if (post.uploadedBy.name !== req.user.name) {
		return next(new AppError("You can delete only your post", 405));
	}

	await cloudinary.uploader.destroy(post.cloudinary_id);
	await post.delete();
	res.status(204).json({
		status: "success",
		data: null,
	});
});
