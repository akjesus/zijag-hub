const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/AdminController");
const {  verifyToken } = require("../controllers/AuthController");

// Admin Dashboard Data (Protected Route)
router.get("/dashboard", verifyToken, getDashboardStats);

module.exports = router;
