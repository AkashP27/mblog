const User = require("../models/User");
const Post = require("../models/Post");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const cloudinary = require("../utils/cloudinary");

exports.getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.find().sort({ id: -1 }).explain();

	if (!users) {
		return next(new AppError("Users not found", 404));
	}
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
});

exports.getAllActiveUsers = catchAsync(async (req, res, next) => {
	const users = await User.find({ active: true }).sort({ id: -1 });

	if (!users) {
		return next(new AppError("Users not found", 404));
	}
	res.status(200).json({
		status: "success",
		results: users.length,
		data: {
			users,
		},
	});
});

exports.getUser = catchAsync(async (req, res, next) => {
	const user = await User.findById(req.params.id)
		.select("+oAuth")
		.cache({ key: req.user.id });

	if (!user) {
		return next(new AppError("Couldn't find user with that ID", 404));
	}

	res.status(200).json({
		status: "success",
		data: {
			user,
		},
	});
});

exports.updateUser = catchAsync(async (req, res, next) => {
	req.user.postKey = "POSTS";

	if (req.body.password) {
		return next(new AppError("This route is not for password update", 400));
	}

	const { name, email } = req.body;

	if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
		return next(new AppError("You can update only your account", 401));
	}

	const updateData = {};
	if (name) updateData.name = name;
	if (email) updateData.email = email;
	if (req.file) {
		const result = await cloudinary.uploader.upload(req.file.path, {
			upload_preset: "mern_avatar",
		});
		updateData.avatarURL = result.secure_url;
	}

	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{
			$set: updateData,
		},
		{
			new: true,
			runValidators: true,
		}
	);

	res.status(200).json({
		status: "success",
		data: {
			updatedUser,
		},
	});
});

exports.deleteUser = catchAsync(async (req, res, next) => {
	if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
		return next(new AppError("You can delete only your account", 401));
	}

	await User.findByIdAndUpdate(req.params.id, { active: false });

	// await Post.deleteMany({ uploadedBy: user._id });
	// await User.findByIdAndDelete(req.params.id);
	res.status(204).json({
		status: "success",
		data: null,
	});
});

exports.getUserPosts = catchAsync(async (req, res, next) => {
	if (JSON.stringify(req.user._id) !== JSON.stringify(req.params.id)) {
		return next(new AppError("You can access only your posts", 401));
	}

	const posts = await Post.find({ uploadedBy: req.params.id })
		.populate({ path: "uploadedBy", select: "name avatarURL" })
		.sort("-createdAt")
		.cache({ key: req.user.id });

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
		},
	});
});
