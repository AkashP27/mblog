const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
});

cloudinary.api.create_upload_preset({
	name: "mern",
	folder: "blog",
});
// .then((result) => console.log(result))
// .catch((err) => console.error(err));

module.exports = cloudinary;
