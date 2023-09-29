const multer = require("multer");
const path = require("path");
const AppError = require("../utils/appError");

// Multer config
module.exports = multer({
	storage: multer.diskStorage({}),
	fileFilter: (req, file, cb) => {
		let ext = path.extname(file.originalname);
		if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
			cb(
				new AppError(
					"File type is not supported. Only png jpg jpeg is allowed",
					415
				),
				false
			);
			return;
		}
		cb(null, true);
	},
});
