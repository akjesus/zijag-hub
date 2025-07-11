//Sales routes
const express = require("express");
const router = express.Router();

const SalesController = require("../controllers/SalesController");

router.post("/", SalesController.createSales);
router.get("/", SalesController.getAllSales);
router.get("/:id", SalesController.findSalesById);
router.put("/:id", SalesController.updateSales);
router.delete("/:id", SalesController.deleteSales);

module.exports = router;