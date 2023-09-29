const mongoose = require("mongoose");
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_DOCKER_URL);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function (options = {}) {
	this.isCache = true;
	this.hashKey = JSON.stringify(options.key || "");
	return this;
};

mongoose.Query.prototype.exec = async function () {
	if (!this.isCache) {
		return exec.apply(this, arguments);
	}
	// console.log(this.getQuery());

	let redisKey;
	JSON.stringify(this.getQuery()).startsWith(`{"title"`)
		? (redisKey = JSON.stringify(
				Object.assign({}, JSON.stringify(this.getQuery().title.$regex), {
					collection: this.mongooseCollection.name,
				})
		  ))
		: (redisKey = JSON.stringify(
				Object.assign({}, this.getQuery(), {
					collection: this.mongooseCollection.name,
				})
		  ));

	// console.log(this.hashKey);
	// console.log(redisKey);
	const cachedValue = await redis.hget(this.hashKey, redisKey);

	if (cachedValue) {
		// console.log("Caching.....!");
		// console.log(JSON.parse(cachedValue));
		const doc = JSON.parse(cachedValue);
		await redis.expire(this.hashKey, 10 * 60); // 10mins

		// console.log(new this.model(doc));
		return Array.isArray(doc)
			? doc.map((d) => new this.model(d))
			: new this.model(doc);
		// return JSON.parse(cachedValue);
	}

	const result = await exec.apply(this, arguments);
	// console.log(result);
	await redis.hset(this.hashKey, redisKey, JSON.stringify(result));
	await redis.expire(this.hashKey, 10 * 60); // 10mins
	return result;
};

module.exports = {
	async clearHash(hashKey) {
		// console.log("called delete");
		redis.del(JSON.stringify(hashKey));
	},
};
