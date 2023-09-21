const getOAuthTokens = require("../utils/OAuthTokens");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const signToken = require("../utils/signJWTToken");
const axios = require("axios");
const qs = require("qs");

const saveOauthUserInDB = async (oAuthUser) => {
	try {
		const user = await User.findOneAndUpdate(
			{ email: oAuthUser.email },
			{
				email: oAuthUser.email,
				name: oAuthUser.name,
			},
			{
				upsert: true,
				new: true,
			}
		).select("+active");

		if (!user?.active) {
			return null;
		}

		user.oAuth = true;
		user.active = true;
		await user.save();

		return user;
	} catch (err) {
		console.log(err);
		throw new AppError(err, 401);
	}
};

exports.googleAuth = catchAsync(async (req, res, next) => {
	// get auth code from query string
	const code = req.query.code;
	// console.log(code);

	const url = "https://oauth2.googleapis.com/token";

	const values = {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.OAUTH_REDIRECT_URL,
		grant_type: "authorization_code",
	};

	// get id & access token using auth code
	const { id_token, access_token } = await getOAuthTokens(code, url, values);
	// // console.log({ id_token, access_token });

	// get user using token
	const googleUser = jwt.decode(id_token);
	// console.log(googleUser);

	if (!googleUser.email_verified) {
		return next(new AppError("Google account is not verified", 403));
	}

	const user = await saveOauthUserInDB(googleUser);

	if (!user?.active) {
		return next(
			new AppError(
				`User no longer exists. Please contact mblog2728@gmail.com to reactivate account`,
				401
			)
		);
	}

	const token = signToken(user._id, user.name);

	res.status(201).json({
		status: "success",
		data: {
			user,
			token,
		},
	});
});

exports.githubAuth = catchAsync(async (req, res, next) => {
	// get auth code from query string
	const code = req.query.code;
	// console.log(code);
	const url = "https://github.com/login/oauth/access_token";

	const values = {
		code,
		client_id: process.env.GITHUB_CLIENT_ID,
		client_secret: process.env.GITHUB_CLIENT_SECRET,
		redirect_uri: process.env.OAUTH_REDIRECT_URL,
		grant_type: "authorization_code",
	};

	// get access token using auth code
	const access_token = await getOAuthTokens(code, url, values);
	// console.log(access_token);

	const decoded = qs.parse(access_token);
	// console.log(decoded);
	const accessToken = decoded.access_token;

	// get user using access token

	const response = await axios.get("https://api.github.com/user", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	const githubUser = response.data;
	// console.log(githubUser);

	if (!githubUser.email) {
		return next(new AppError("You didn't provide Email address to github..!"));
	}

	const user = await saveOauthUserInDB(githubUser);

	if (!user?.active) {
		return next(
			new AppError(
				`User no longer exists. Please contact mblog2728@gmail.com to reactivate account`,
				401
			)
		);
	}

	const token = signToken(user._id, user.name);

	res.status(201).json({
		status: "success",
		data: {
			user,
			token,
		},
	});
});
