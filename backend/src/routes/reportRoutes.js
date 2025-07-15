const express = require("express");
const router = express.Router();
const ReportController = require("../controllers/ReportController");


//get summary report for an inventory, income, and expense
router.get("/summary", ReportController.getSummaryReport);
router.get("/sales", ReportController.salesReport);
router.get("/incomes", ReportController.incomeReport);
router.get("/expenses", ReportController.expenseReport);
router.get("/daily", ReportController.getDailyItemsAndTotals);

module.exports = router;

