const Redis = require("ioredis");
const redis = new Redis();
const AppError = require("../utils/appError");

module.exports = ({ secondsWindow, allowedHits }) => {
	return async (req, res, next) => {
		//Get the IP address
		const ip = req.headers["x-forwaded-for"] || req.connection.remoteAddress;
		const requests = await redis.incr(ip);
		requests === 1 && (await redis.expire(ip, secondsWindow));

		if (requests > allowedHits) {
			return next(
				new AppError("Too many requests. Please try again after 10 mins", 429)
			);
		}

		next();
	};
};
