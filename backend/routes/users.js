const router = require("express").Router();
const User = require("../moduls/User");
const bcrypt = require("bcrypt");

//reqister

router.post("/reqister", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const user = await newUser.save();
    return res.status(200).json(user._id);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// login

router.post("/login", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).json("Wrong username");
  }
  const vaildPassword = await bcrypt.compare(req.body.password, user.password);
  if (!vaildPassword) {
    return res.status(400).json("Wrong password");
  }
  return res.status(200).json({ _id: user._id, username: user.username });

  try {
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
