const rateLimit = require("express-rate-limit");

module.exports = rateLimit({
	max: 30,
	windowMs: 10 * 60 * 1000,
	message: {
		message: "Too many requests. Please try after 10 minutes",
	},
});
