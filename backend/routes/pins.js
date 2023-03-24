const router = require("express").Router();
const Pin = require("../moduls/Pin");

router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savePin = await newPin.save();
    return res.status(200).json(savePin);
  } catch (err) {
    return res.status(500).json(err);
  }
});

// get all pin

router.get("/", async (req, res) => {
  try {
    const pins = await Pin.find();
    return res.status(200).json(pins);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
