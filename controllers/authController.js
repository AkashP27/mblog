const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signToken = (id, name) => {
	return jwt.sign({ id, name }, process.env.JWT_SECRET_KEY, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.registerForm = async (req, res) => {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPass = await bcrypt.hash(req.body.password, salt);
		// const hashedConfPass = await bcrypt.hash(req.body.confpassword, salt);

		const newUser = new User({
			name: req.body.name,
			email: req.body.email,
			password: hashedPass,
			// confpassword: hashedConfPass,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
};

exports.loginUser = async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });

		if (!user) {
			return res.status(400).json("Wrong credentials");
		}

		const validated = await bcrypt.compare(req.body.password, user.password);

		if (!validated) {
			return res.status(400).json("Wrong credentials");
		}

		const token = signToken(user._id, user.name);
		// console.log(user._docs);

		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, token });
	} catch (err) {
		// res.status(500).json(err);
		console.log(err);
	}
};
