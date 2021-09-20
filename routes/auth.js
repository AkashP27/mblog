const router = require("express").Router();
const User = require("../models/User");
const bcryptjs = require("bcryptjs");

// REGISTER

router.post("/register", async (req, res) => {
  try {
    const salt = await bcryptjs.genSalt(10);
    const hashedPass = await bcryptjs.hash(req.body.password, salt);
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
});

// LOGIN

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    !user && res.status(400).json("Wrong credentials");

    const validated = await bcryptjs.compare(req.body.password, user.password);
    !validated && res.status(400).json("Wrong credentials");

    const{password, ...others} = user._doc;
    res.status(200).json(others);
  } catch(err) {
    res.status(500).json(err);
  }
});






module.exports = router;
