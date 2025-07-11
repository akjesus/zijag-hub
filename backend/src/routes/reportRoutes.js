const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// GET detailed report for an exam (optional department filter)
router.get("/exam/:exam_id", reportController.getExamDetailedReport);

//get summary report for an inventory, income, and expense
router.get("/summary", reportController.getSummaryReport);

module.exports = router;
