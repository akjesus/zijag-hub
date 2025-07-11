const express = require("express");
const router = express.Router();
const IncomeController = require("../controllers/IncomeController");
const { verifyToken, isAdmin } = require("../controllers/AuthController");


router.get("/", IncomeController.getAllIncome);
router.post("/", verifyToken, IncomeController.createIncome);
router.get("/:id", IncomeController.findIncomeById);
router.delete("/:id", verifyToken, isAdmin, IncomeController.deleteIncome);
router.put("/:id", verifyToken, isAdmin, IncomeController.updateIncome); // Assuming you have an updateIncome method
// Note: Ensure that the method is defined in IncomeController

module.exports = router;
