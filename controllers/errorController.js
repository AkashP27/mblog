const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
	let message;
	if (err.keyValue.name) {
		message = `Username (${err.keyValue.name}) already taken`;
	} else if (err.keyValue.email) {
		message = `User exists with this email`;
	} else {
		message = `Duplicate field value. Please use another value instead`;
	}
	// const duplicateField = err.keyValue.name || err.keyValue.email;
	// console.log(duplicateField);
	// const message = `Duplicate field value ${duplicateField}. Please use another value instead`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);

	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJWTError = () => {
	return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
	return new AppError("Your token has expired! Please log in again.", 401);
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "error";

	// console.log(err.name);
	// console.log(err.statusCode);

	// let error = { ...err };

	if (err.name === "CastError") {
		err = handleCastErrorDB(err);
	}

	if (err.code === 11000) {
		err = handleDuplicateFieldsDB(err);
	}

	if (err.name === "ValidationError") {
		err = handleValidationErrorDB(err);
	}

	if (err.name === "JsonWebTokenError") {
		err = handleJWTError();
	}

	if (err.name === "TokenExpiredError") {
		err = handleJWTExpiredError();
	}

	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
			err: err,
			// stack: err.stack,
		});

		// Unknown error, don't leak error details
	} else {
		console.log("ERROR", err);
		res.status(500).json({
			status: "error",
			message: "Something went very wrong.!",
		});
	}
};
