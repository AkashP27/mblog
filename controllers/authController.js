const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");

const signToken = (id, name) => {
	return jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.registerUser = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);
		// const hashedConfPass = await bcrypt.hash(req.body.confpassword, salt);

		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPass,
			// confpassword: hashedConfPass,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

exports.loginUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(400).json("Wrong credentials");
		}

		const validated = await bcrypt.compare(req.body.password, user.password);

		if (!validated) {
			return res.status(400).json("Wrong credentials");
		}

		const token = signToken(user._id, user.name);
		// console.log(user._docs);

		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, token });
	} catch (err) {
		// res.status(500).json(err);
		console.log(err);
	}
};

exports.protect = async (req, res, next) => {
	let token;
	let decoded;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// console.log(token);

	if (!token) {
		return res
			.status(401)
			.json("Token is not present, you're not authenticated");
	}

	try {
		decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
		// console.log(decoded);
	} catch (err) {
		return res.status(401).json("Invalid token");
	}

	//check if user still exists
	const freshUser = await User.findById(decoded.id);
	if (!freshUser) {
		return res
			.status(401)
			.json("User belonging to this token does no longer exist");
	}

	req.user = freshUser;
	// console.log(req.user._id);
	next();
};

exports.forgotPassword = async (req, res, next) => {
	// console.log(req.body.email);
	// 1) Get user based on provided email
	const user = await User.findOne({ email: req.body.email });

	if (!user) {
		return res.status(404).json("User does not exist with this email address.");
		// return next(
		// 	res.status(404).json("User does not exist with this email address.")
		// );
	}
	// 2) Generate random reset token
	const resetToken = crypto.randomBytes(32).toString("hex");
	user.passwordResetToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");

	// console.log({ resetToken }, user.passwordResetToken);

	user.passwordResetExpires = Date.now() + 10 * 60 * 1000; //10mins
	await user.save({ validateBeforeSave: false });

	// 3) Send token to user's email
	const resetURL = `${req.protocol}://localhost:3006/reset-password/${resetToken}`;

	const message = `Forgot your password? Enter your new password here: ${resetURL}\nIf you didn't forget your password, please ignore this email`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Your password reset token (valid for 10mins)",
			message,
		});

		res.status(200).json("Token sent to email");
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return res
			.status(500)
			.res("There was an error sending the email. Try again later.");
	}
};

exports.resetPassword = async (req, res, next) => {
	// 1) Get user based on token
	const hashedToken = crypto
		.createHash("sha256")
		.update(req.params.token)
		.digest("hex");

	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	// 2) If token is not expired and user exists, set new password
	if (!user) {
		// return next(new Error("Token is invalid or expired", 400));
		return res.status(400).json("Token is invalid or expired");
	}

	const hashedPass = await bcrypt.hash(req.body.password, 10);

	user.password = hashedPass;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.status(200).json("Password Changed successfully");
};
