const express = require("express");
const router = express.Router();
const { registerUser, registerOwner, refreshToken, login } = require("../controllers/authControllers");

router.post("/user_register", registerUser);

router.post("/owner_register", registerOwner);

router.post("/refresh_token", refreshToken);
router.post("/login", login);


module.exports = router;