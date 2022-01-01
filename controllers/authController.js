const User = require("../models/User");
const bcrypt = require("bcrypt");

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

exports.loginForm = async (req, res) => {
 try {
  const user = await User.findOne({ name: req.body.name });
  !user && res.status(400).json("Wrong credentials");

  const validated = await bcrypt.compare(req.body.password, user.password);
  !validated && res.status(400).json("Wrong credentials");

  const { password, ...others } = user._doc;
  res.status(200).json(others);
 } catch (err) {
  res.status(500).json(err);
 }
};
