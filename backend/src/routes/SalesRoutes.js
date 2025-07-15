//Sales routes
const express = require("express");
const router = express.Router();
const { verifyToken, isAdmin } = require("../controllers/AuthController");

const SalesController = require("../controllers/SalesController");

router.post("/", verifyToken, isAdmin, SalesController.createSales);
router.get("/", SalesController.getAllSales);

router.get("/:id", SalesController.findSalesById).put(
  "/:id",   
  verifyToken,
  isAdmin,
  SalesController.updateSales
).delete("/:id", verifyToken, isAdmin, SalesController.deleteSales);
router.get(
  "/receipt/:id",
  verifyToken,
  isAdmin,
  SalesController.generateReceipt
);

module.exports = router;