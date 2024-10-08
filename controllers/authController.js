const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const signToken = require("../utils/signJWTToken");
const sendEmail = require("../utils/email");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

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
	}).select("+password +active +oAuth");

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

	if (user.oAuth) {
		return next(new AppError("Please login using Google", 401));
	}

	const validated = await bcrypt.compare(req.body.password, user.password);

	if (!validated) {
		return next(new AppError("Wrong Credentials", 401));
	}

	if (user.passwordResetToken && user.passwordResetExpires) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();
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
	if (!req.body.email) {
		return next(new AppError("Please provide an email address", 400));
	}

	// 1) Get user based on provided email
	const user = await User.findOne({
		email: req.body.email,
	}).select("+active +oAuth");

	if (!user) {
		return next(
			new AppError("User does not exist with this email address.", 404)
		);
	}

	if (user.oAuth) {
		return next(new AppError("Please login using Google", 401));
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
	const resetURL = `${req.protocol}://localhost:3000/reset-password/${resetToken}`;

	const message = `
	<!DOCTYPE html>
	<html>
		<head>
			<style>
				body {
					font-family: Arial, sans-serif;
				}
				.email-wrapper {
					background-color: #e1e5ea;
					padding: 30px;
					display: block;
				}
				.email {
					overflow: hidden;
					width: 540px;
					max-width: 100%;
					background-color: white;
					border-top: 30px solid white;
					border-bottom: 30px solid white;
					border-radius: 3px;
					margin: 0 auto;
				}
				.email-content {
					border-radius: 5px;
					padding: 20px;
				}
				.button {
					background-color: #36d7b7;
					color: white !important;
					padding: 10px 10px;
					text-decoration: none;
					border-radius: 5px;
				}
				.button:hover {
					background-color: #076e59;
				}
			</style>
		</head>
		<body>
			<div class="email-wrapper">
				<div class="email">
					<div align="center">
						<a href="https://mblog-akash.netlify.app/">
							<img
								src="https://res.cloudinary.com/dhct9yoaz/image/upload/v1713189093/vwhvynhbzficphrghjg8.png"
								width="128px"
							/>
						</a>
						<h1>MULTIPURPOSE BLOG</h1>
					</div>
					<div class="email-content">
						<p>Hello <strong>${user.name}</strong>,</p>
						<p>
							We received a request to reset your password for your MBLOG account.
						</p>
						<p>
							If you did not make this request, you can safely ignore this email.
							Your account is secure.
						</p>
						<p>To reset your password, please click on the button below:</p>
						<p><a class="button" href="${resetURL}">Reset Password</a></p>
						<p>Please note that this link is valid for 10 minutes only.</p>
						<p>Thank you,<br />The Mblog Team</p>
					</div>
				</div>
			</div>
		</body>
	</html>

	`;

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
	if (!passwordValidate(req.body.password)) {
		return next(
			new AppError(
				"Password should be minimum 6 characters, atleast one upper and lower case, one number, one special character",
				400
			)
		);
	}

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

exports.updatePassword = catchAsync(async (req, res, next) => {
	if (!passwordValidate(req.body.newPassword)) {
		return next(
			new AppError(
				"Password should be minimum 6 characters, atleast one upper and lower case, one number, one special character",
				400
			)
		);
	}

	const user = await User.findById(req.user._id).select("+password +oAuth");

	if (user.oAuth) {
		return next(new AppError("Please login using Google", 401));
	}

	const comparePassword = async (candidatePassword, userPassword) => {
		return await bcrypt.compare(candidatePassword, userPassword);
	};

	if (!(await comparePassword(req.body.currentPassword, user.password))) {
		return next(new AppError("Your current password is incorrect", 401));
	}

	const salt = await bcrypt.genSalt(10);
	req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

	user.password = req.body.newPassword;
	await user.save();

	res.status(200).json({
		status: "success",
		message: "Password updated successfully. Please Login again",
	});
});
