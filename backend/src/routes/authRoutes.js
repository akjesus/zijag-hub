// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
	getAllUsers,
	login,
	createUser,
	logout,
	isAdmin,
	verifyToken,
	makeAdmin,
} = require("../controllers/AuthController");

router.get("/", getAllUsers);
router.post("/login", login);
router.post("/register", verifyToken, isAdmin, createUser); // Only for initial setup
router.patch("/make-admin/:id", verifyToken, isAdmin, makeAdmin); // Only for initial setup
router.post("/logout", logout);

module.exports = router;
