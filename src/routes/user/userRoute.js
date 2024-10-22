const express = require("express");
const {
  signup,
  login,
  appointment,
  generateOtp,
  changeUserPassword,
} = require("../../controller/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/otp", generateOtp);
router.post("/login", login);
router.get("/app", appointment);
router.patch("/password", changeUserPassword);

module.exports = router;
