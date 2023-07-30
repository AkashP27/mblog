const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
};

exports.updateUser = async (req, res) => {
	const id1 = JSON.stringify(req.user._id);
	const id2 = JSON.stringify(req.params.id);

	if (id1 === id2) {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hash(req.body.password, salt);
		}
		try {
			const updatedUser = await User.findByIdAndUpdate(
				req.params.id,
				{
					$set: req.body,
				},
				{ new: true }
			);

			res.status(200).json({ updatedUser });
		} catch (err) {
			res.status(500).json(err);
		}
	} else {
		res.status(401).json("You can update only your account");
	}
};

exports.deleteUser = async (req, res) => {
	const id1 = JSON.stringify(req.user._id);
	const id2 = JSON.stringify(req.params.id);
	if (id1 === id2) {
		try {
			const user = await User.findById(req.params.id);
			try {
				await Post.deleteMany({ name: user.name });
				await User.findByIdAndDelete(req.params.id);
				res.status(200).json("User has been deleted...");
			} catch (err) {
				res.status(500).json(err);
			}
		} catch (err) {
			res.status(500).json("User not found");
		}
	} else {
		res.status(401).json("You can delete only your account");
	}
};

exports.getUsersPosts = async (req, res) => {
	// console.log(req.user.name);
	try {
		const post = await Post.find({ name: req.user.name }).sort({ _id: -1 });
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
};
