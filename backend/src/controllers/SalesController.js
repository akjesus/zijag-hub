const Sales = require("../models/SalesModel");
const Category = require("../models/CategoryModel");

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sales.find()
      .sort({ createdAt: -1 })
      .populate("createdBy", "username")
      .populate("category", "name"); // Populate createdBy with user details
    if (sales.length === 0) {
      return res.status(200).json({ message: "No sales found" });
    }

    res.status(200).json(sales);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createSales = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { title, category, amount, description, source } = req.body;
    if (!title || !category || !amount) {
      return res
        .status(400)
        .json({ message: "Title, category, and amount are required" });
    }
    const newSales = new Sales({
      title,
      description,
      category,
      amount,
      source,
      createdBy: req.user.id, // Assuming req.user is set by authentication middleware
    });
    await newSales.save();
    res.status(201).json(newSales);
  } catch (error) {
    console.log("Error creating sales:", error);
    res.status(500).json({ error: error.message });
  }
};
exports.findSalesById = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "sales ID is required" });
  }
  try {
    const sales = await Sales.findById(req.params.id);
    if (!sales) {
      return res.status(404).json({ message: "sales not found" });
    }
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSales = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "sales ID is required" });
  }
  try {
    const sales = await Sales.findById(id);
    if (!sales) {
      return res.status(404).json({ message: "sales not found" });
    }
    await Sales.findByIdAndDelete(id);
    res.status(200).json({ message: "sales deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateSales = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "sales ID is required" });
  }
  try {
    const sales = await Sales.findByIdAndUpdate(id, req.body, { new: true });
    if (!sales) {
      return res.status(404).json({ message: "sales not found" });
    }
    res.status(200).json(sales);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


