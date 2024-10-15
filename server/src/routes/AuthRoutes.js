const express = require("express");
const router = express.Router();
const { registerUser, loginUser, registerOwner, loginOwner, verifyEmail } = require("../controllers/authControllers");

router.post("/user_register", registerUser);
router.post("/user_login", loginUser);
router.post("/owner_register", registerOwner);
router.post("/owner_login", loginOwner);


module.exports = router;
