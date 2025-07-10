const express = require("express");
const router = express.Router();
const Category = require("../models/CategoryModel");



router.get("/", async (req, res) => {
    try {
        const categories = await Category.find().sort({ name: 1 });
        if (categories.length === 0) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
router.post("/", async (req,res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ message: "Category name is required" });
    }
    const newCategory = new Category({ name });
    await newCategory.save()
        .then(category => res.status(201).json(category))
        .catch(err => res.status(500).json({ error: err.message }));
});

module.exports = router;
