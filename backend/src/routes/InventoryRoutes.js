const express = require("express");
const router = express.Router();    

const InventoryController = require("../controllers/InventoryController");
const { verifyToken, isAdmin } = require("../controllers/AuthController");

// Get all inventories
router.get("/", InventoryController.getAllInventories);
// Create a new inventory item
router.post("/", verifyToken, isAdmin, InventoryController.createInventory);
// Get inventory by ID
router.get("/:id", InventoryController.findInventoryById);
// Delete inventory by ID
router.delete("/:id", verifyToken, isAdmin, InventoryController.deleteInventory);
// Update inventory by ID
router.put("/:id", verifyToken, isAdmin, InventoryController.updateInventory);
// Get total cost and selling price
router.get("/total", InventoryController.getTotalInventory);
// Get inventory by category
router.get("/category/:categoryId", InventoryController.getInventoryByCategory);
// Get inventory by name
router.get("/search/:name", InventoryController.searchInventoryByName);
// Get inventory by date range
router.get("/date-range", InventoryController.getInventoryByDateRange);
// Sell inventory item
router.post("/sell/:id", verifyToken, InventoryController.sellInventoryItem);
// Bulk upload inventory items
router.post("/bulk-upload", verifyToken, isAdmin, InventoryController.bulkUploadInventory);

module.exports = router;
