const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id, name) => {
	return jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const passwordValidate = (password) => {
	// console.log("Checking password");
	const PASSWORD_REGEX =
		/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{6,}$/;

	return PASSWORD_REGEX.test(password) ? true : false;
};

exports.registerUser = catchAsync(async (req, res, next) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return next(new AppError("Fields cannot be empty", 400));
	}

	// if (password.length < 6) {
	// 	return next(new AppError("Password should be atleast 6 characters", 400));
	// }

	if (!passwordValidate(password)) {
		return next(
			new AppError(
				"Password should be minimum 6 characters, atleast one upper and lower case, one number, one special character",
				400
			)
		);
	}

	const hashedPass = await bcrypt.hash(password, 10);

	const newUser = new User({
		name,
		email,
		password: hashedPass,
	});

	const user = await newUser.save();
	user.password = undefined;

	res.status(201).json({
		status: "success",
		data: {
			user,
		},
	});
});

exports.loginUser = catchAsync(async (req, res, next) => {
	const user = await User.findOne({
		email: req.body.email,
	}).select("+password +active");

	if (!user) {
		return next(new AppError("Wrong Credentials", 401));
	}

	if (!user?.active) {
		return next(
			new AppError(
				`User no longer exists. Please contact mblog2728@gmail.com to reactivate account`,
				401
			)
		);
	}

	const validated = await bcrypt.compare(req.body.password, user.password);

	if (!validated) {
		return next(new AppError("Wrong Credentials", 401));
	}

	const token = signToken(user._id, user.name);
	user.password = undefined;

	res.status(200).json({
		status: "success",
		data: {
			user,
			token,
		},
	});
});

exports.protect = catchAsync(async (req, res, next) => {
	let token;
	// let decoded;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		token = req.cookies.jwt;
	}
	// console.log(token);
	if (!token) {
		return next(
			new AppError("Token is not present, you're not authenticated", 401)
		);
	}

	// Verification token
	const decoded = await promisify(jwt.verify)(
		token,
		process.env.JWT_SECRET_KEY
	);
	// console.log(decoded);

	//check if user still exists
	const freshUser = await User.findById(decoded.id);
	if (!freshUser) {
		return next(
			new AppError("User belonging to this token does no longer exist", 401)
		);
	}

	req.user = freshUser;
	// console.log(req.user._id);
	next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
	// console.log(req.body.email);
	if (!req.body.email) {
		return next(new AppError("Please provide an email address", 400));
	}

	// 1) Get user based on provided email
	const user = await User.findOne({
		email: req.body.email,
	}).select("+active");

	if (!user) {
		return next(
			new AppError("User does not exist with this email address.", 404)
		);
	}

	if (!user?.active) {
		return next(
			new AppError(
				`User no longer exists. Please contact mblog2728@gmail.com to reactivate account`,
				401
			)
		);
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

		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (err) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new AppError("There was an error sending email. Please try again later!")
		);
	}
});

exports.resetPassword = catchAsync(async (req, res, next) => {
	// if (!req.body.password) {
	// 	return next(new AppError("Please enter your password", 400));
	// }

	if (!passwordValidate(req.body.password)) {
		return next(
			new AppError(
				"Password should be minimum 6 characters, atleast one upper and lower case, one number, one special character",
				400
			)
		);
	}

	// if (req.body.password.length < 6) {
	// 	return next(new AppError("Password should be atleast 6 characters", 400));
	// }

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
		return next(new AppError("Token is invalid or expired", 400));
	}

	const hashedPass = await bcrypt.hash(req.body.password, 10);

	user.password = hashedPass;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();
	res.status(200).json({
		status: "success",
		message: "Password Changed successfully",
	});
});
