const Inventory = require('../models/InventoryModel');
const Income = require('../models/IncomeModel');
const Sales = require('../models/SalesModel');
const csvParser = require("csv-parser");
const stream = require("stream");


exports.getAllInventories= async (req, res)=> {
    try {
        const inventory = await Inventory.find()
          .sort({ date: -1 })
          .populate("createdBy", "firstName lastName")
          .populate("category", "name"); // Populate createdBy with user details
        if (inventory.length === 0) {
          return res.status(200).json({ message: "No inventory found" });
        }
        const result = inventory.map((item, index) => ({
          serialNumber: index + 1,
          ...item.toObject(),
        }));        
        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createInventory = async (req, res) => { 
    const { name, description, category, costPrice, sellingPrice, quantity } = req.body;
    try {
        const newInventory = new Inventory({
            name,
            description,
            category,
            costPrice,
            sellingPrice,
            quantity,
            createdBy: req.user.id
        });
        await newInventory.save();
        res.status(201).json({ message: "Inventory item created successfully", inventory: newInventory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.findInventoryById = async (req, res) => {
    const { id } = req.params;
    try {
        const inventory = await Inventory.findById(id)
          .populate("createdBy", "firstName lastName")
          .populate("category", "name");
        if (!inventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.deleteInventory = async (req, res) => {
    const { id } = req.params;
    try {
        const inventory = await Inventory.findByIdAndDelete(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json({ message: "Inventory item deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.updateInventory = async (req, res) => {
    const { id } = req.params;
    const { name, description, category, costPrice, sellingPrice, quantity } = req.body;
    try {
        const inventory = await Inventory.findByIdAndUpdate(
            id,
            { name, description, category, costPrice, sellingPrice, quantity },
            { new: true }
        );
        if (!inventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        res.status(200).json({ message: "Inventory item updated successfully", inventory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.getTotalInventory = async (req, res) => {
    try {
        const total = await Inventory.getTotal();
        res.status(200).json(total);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getInventoryByCategory = async (req, res) => {
    const { categoryId } = req.params;
    try {
        const inventory = await Inventory.find({ category: categoryId })
          .populate("createdBy", "firstName lastName")
          .populate("category", "name");
        if (inventory.length === 0) {
            return res.status(404).json({ message: "No inventory found for this category" });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.searchInventoryByName = async (req, res) => {
    const { name } = req.params;
    try {
        const inventory = await Inventory.find({ name: new RegExp(name, 'i') })
          .populate("createdBy", "firstName lastName")
          .populate("category", "name");
        if (inventory.length === 0) {
            return res.status(404).json({ message: "No inventory found with this name" });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getInventoryByDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    try {
        const inventory = await Inventory.find({
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
          .populate("createdBy", "firstName lastName")
          .populate("category", "name");
        if (inventory.length === 0) {
            return res.status(404).json({ message: "No inventory found in this date range" });
        }
        res.status(200).json(inventory);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.sellInventoryItem = async (req, res) => {
    const { id } = req.params;
    const { quantity, source } = req.body;
    try {
        const inventory = await Inventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: "Inventory item not found" });
        }
        if (inventory.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }
        inventory.quantity -= quantity;
        await inventory.save();
        await Income.create({
            title: `Sold ${inventory.name}`,
            category: inventory.category,
            amount: inventory.sellingPrice * quantity,
            source: source,
            description: `Sold ${quantity} pcs of "<b>${inventory.name}</b>"`,
            createdBy: req.user.id
        });
        await Sales.create({
            description: `Sold ${quantity} pcs of "<b>${inventory.name}</b>"`,
            category: inventory.category,
            amount: inventory.sellingPrice * quantity,
            quantity: quantity,
            source: source,
            createdBy: req.user.id
        });
        res.status(200).json({ message: "Inventory item sold successfully", inventory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.bulkUploadInventory = async (req, res) => {
  const { category } = req.body;
  const createdBy = req.user.id;

  try {
    // Check if file is present
    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: "CSV file is required" });
    }

    const csvFile = req.files.file;
    const bufferStream = new stream.PassThrough();
    bufferStream.end(csvFile.data);

    const inventoriesToInsert = []; // for student fields
    // We'll store them as arrays of [course_id, level_id, ... user_id], then link after

    bufferStream
      .pipe(csvParser())
      .on("data", (row) => {
        // Extract the fields from CSV row
        // We'll parse them carefully, assuming columns are consistent
        const { name, description, quantity, costPrice, sellingPrice } = row;
        // We'll store this row data
        inventoriesToInsert.push({
          name,
          description,
          category,
          quantity,
          costPrice,
          sellingPrice,
          createdBy,
        });
      })
      .on("end", async () => {
        if (!inventoriesToInsert.length) {
          return res
            .status(400)
            .json({ error: "No valid student data found in CSV" });
        }

        let insertedCount = 0;

        // We'll process each inventory row individually
        for (const qRow of inventoriesToInsert) {
          // Insert new inventory
          const result = await Inventory.insertMany(qRow);
          if (result && result.length > 0) {
            insertedCount += result.length;
          }
        }
        res.status(201).json({
          message: `${insertedCount} inventories successfully uploaded`,
        });
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
