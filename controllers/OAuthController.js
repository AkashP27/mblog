const getOAuthTokens = require("../utils/OAuthTokens");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id, name) => {
	return jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.googleAuth = catchAsync(async (req, res, next) => {
	// get auth code from query string
	const code = req.query.code;
	// console.log(code);

	// get id & access token using auth code
	const { id_token, access_token } = await getOAuthTokens(code);
	// console.log({ id_token, access_token });

	// get user using token
	const googleUser = jwt.decode(id_token);
	// console.log(googleUser);

	if (!googleUser.email_verified) {
		return next(new AppError("Google account is not verified", 403));
	}

	const user = await User.findOneAndUpdate(
		{ email: googleUser.email },
		{
			email: googleUser.email,
			name: googleUser.name,
		},
		{
			upsert: true,
			new: true,
		}
	).select("+active");

	if (!user?.active) {
		return next(
			new AppError(
				`User no longer exists. Please contact mblog2728@gmail.com to reactivate account`,
				401
			)
		);
	}

	user.oAuth = true;
	user.active = true;
	await user.save();
	const token = signToken(user._id, user.name);

	res.status(201).json({
		status: "success",
		data: {
			user,
			token,
		},
	});
});
