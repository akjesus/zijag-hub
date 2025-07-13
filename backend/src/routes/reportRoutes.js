const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");

// GET detailed report for an exam (optional department filter)
router.get("/exam/:exam_id", ReportController.getExamDetailedReport);

//get summary report for an inventory, income, and expense
router.get("/summary", ReportController.getSummaryReport);
router.get("/sales", ReportController.sellingItems);

module.exports = router;

