const mongoose = require("mongoose");
const Redis = require("ioredis");

const redis = new Redis(process.env.LOCAL_REDIS_URL);
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

	const key = JSON.stringify({
		query: this.getQuery(),
		collection: this.mongooseCollection.name,
		populate: this._mongooseOptions.populate,
		options: this.options,
	});

	const cachedValue = await redis.hget(this.hashKey, key);

	if (cachedValue) {
		const doc = JSON.parse(cachedValue);

		if (Array.isArray(doc)) {
			// Handle array case
			const populatedDocs = await Promise.all(
				doc.map(async (d) => {
					const modelInstance = new this.model(d);
					if (this._mongooseOptions.populate) {
						const { path, select } = this._mongooseOptions.populate.uploadedBy;
						await modelInstance.populate({ path, select }).execPopulate();
					}
					return modelInstance;
				})
			);
			return populatedDocs;
		} else {
			// Handle object case
			const modelInstance = new this.model(doc);
			if (this._mongooseOptions.populate) {
				const { path, select } = this._mongooseOptions.populate.uploadedBy;
				await modelInstance.populate({ path, select }).execPopulate();
			}
			return modelInstance;
		}
	}

	const result = await exec.apply(this, arguments);

	await redis.hset(this.hashKey, key, JSON.stringify(result));
	await redis.expire(this.hashKey, 10 * 60); // 10 minutes
	return result;
};

module.exports = {
	async clearHash(hashKey) {
		redis.del(JSON.stringify(hashKey));
	},
};
