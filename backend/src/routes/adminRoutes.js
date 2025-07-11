const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const { verifyAdmin } = require("../middleware/authMiddleware");

// Admin Dashboard Data (Protected Route)
router.get("/dashboard", verifyAdmin, adminController.getDashboardStats);

module.exports = router;
