const qs = require("qs");
const axios = require("axios");

module.exports = getOAuthTokens = async (url, values) => {
	try {
		const res = await axios.post(url, qs.stringify(values), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		// console.log(res.data);
		return res.data;
	} catch (err) {
		console.log(err.response);
	}
};
