const { clearHash } = require("../utils/cache");

module.exports = async (req, res, next) => {
	await next();
	// console.log(req.user.id);

	clearHash(req.user.id);
	clearHash(req.user.postKey);
};
