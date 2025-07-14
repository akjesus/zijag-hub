const express = require("express");
const router = express.Router();    

const InventoryController = require("../controllers/InventoryController");
const { verifyToken, isAdmin } = require("../controllers/AuthController");

// Get all inventories
router.get("/", InventoryController.getAllInventories);
router.post("/", verifyToken, isAdmin, InventoryController.createInventory);
router.get("/:id", InventoryController.findInventoryById);
router.delete("/:id", verifyToken, isAdmin, InventoryController.deleteInventory);
router.put("/:id", verifyToken, isAdmin, InventoryController.updateInventory);
router.get("/total", InventoryController.getTotalInventory);
router.get("/category/:categoryId", InventoryController.getInventoryByCategory);
router.get("/search/:name", InventoryController.searchInventoryByName);
router.get("/date-range", InventoryController.getInventoryByDateRange);
router.post("/sell/:id", verifyToken, InventoryController.sellInventoryItem);
router.post("/bulk-upload", verifyToken, isAdmin, InventoryController.bulkUploadInventory);

module.exports = router;
