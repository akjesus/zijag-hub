const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");

// GET detailed report for an exam (optional department filter)
router.get("/exam/:exam_id", ReportController.getExamDetailedReport);

//get summary report for an inventory, income, and expense
router.get("/summary", ReportController.getSummaryReport);
router.get("/sales", ReportController.salesReport);
router.get("/incomes", ReportController.incomeReport);
router.get("/expenses", ReportController.expenseReport);
router.get("/daily", ReportController.getDailyItemsAndTotals);

module.exports = router;

