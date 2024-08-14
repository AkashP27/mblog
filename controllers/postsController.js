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
	req.user.postKey = "POSTS";

	if (!req.file) {
		return next(new AppError(`Please upload a file`, 500));
	}

	const result = await cloudinary.uploader.upload(req.file.path);
	const newPost = new Post({
		title: req.body.title,
		desc: req.body.desc,
		category: JSON.parse(req.body.category),
		imageURL: result.secure_url,
		cloudinary_id: result.public_id,
		author: req.body.author,
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
	const search = req.query.search || "";
	const featured = req.query.featured || "";
	const category = req.query.category || "";
	const page = parseInt(req.query.page, 10) || 1;
	const limit = req.query.page ? 6 : 0;
	const skip = (page - 1) * limit;

	const searchQuery = {
		...(category && { category }),
		...(featured && { featured }),
		$or: [
			{ title: { $regex: search, $options: "i" } },
			{ author: { $regex: search, $options: "i" } },
		],
	};

	const postCountPromise = Post.countDocuments();
	const postsPromise = Post.find(searchQuery)
		.populate({
			path: "uploadedBy",
			select: "name avatarURL",
		})
		.sort("-createdAt")
		.limit(limit)
		.skip(skip)
		.cache({ key: "POSTS" });

	const [postCount, posts] = await Promise.all([
		postCountPromise,
		postsPromise,
	]);

	if (!posts || posts.length === 0) {
		return next(new AppError("No posts found", 404));
	}

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
			postCount,
		},
	});
});

exports.getSinglePost = catchAsync(async (req, res, next) => {
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
	req.user.postKey = "POSTS";

	let unEscapedStr = unEscape(req.body.desc);

	const post = await Post.findById(req.params.id).populate({
		path: "uploadedBy",
		select: "-__v",
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
	req.user.postKey = "POSTS";

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

exports.getPostsByAuthor = catchAsync(async (req, res, next) => {
	const authorId = req.params.authorId;

	const posts = await Post.find({ uploadedBy: authorId })
		.populate({
			path: "uploadedBy",
			select: "name",
		})
		.sort("-createdAt");

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
		},
	});
});

exports.getRandomPosts = catchAsync(async (req, res, next) => {
	let query = {};
	const { exclude } = req.query;

	if (exclude) {
		query._id = { $ne: exclude };
	}

	const posts = await Post.aggregate([
		{ $match: query },
		{ $sample: { size: 4 } },
	]);

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
		},
	});
});
