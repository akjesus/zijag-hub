// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController");

router.get("/", authController.getAllUsers);
router.post("/login", authController.login);
router.post("/register", authController.createUser); // Only for initial setup
router.post("/logout", authController.logout);

module.exports = router;
