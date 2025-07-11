const express = require("express");
const router = express.Router();
const ExpensesController = require("../controllers/ExpensesController");
const { verifyToken, isAdmin } = require("../controllers/AuthController");


router.get("/", ExpensesController.getAllExpense);
router.post("/", verifyToken, ExpensesController.createExpense);
router.get("/:id", ExpensesController.findExpenseById);
router.delete("/:id", verifyToken, isAdmin, ExpensesController.deleteExpense);
router.put("/:id", verifyToken, isAdmin, ExpensesController.updateExpenses); // Assuming you have an updateExpense method
// Note: Ensure that the method is defined in IncomeController

module.exports = router;
