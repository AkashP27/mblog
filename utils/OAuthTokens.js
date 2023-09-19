const qs = require("qs");
const axios = require("axios");

module.exports = getOAuthTokens = async (code) => {
	const values = {
		code,
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URL,
		grant_type: "authorization_code",
	};

	const url = "https://oauth2.googleapis.com/token";
	try {
		const res = await axios.post(url, qs.stringify(values), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err);
	}
};
