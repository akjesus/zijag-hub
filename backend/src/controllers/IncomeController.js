const Income = require("../models/IncomeModel");



exports.getAllIncome = async (req, res)=> {
    try {
        const incomes = await Income.find().sort({ date: -1 }).populate('createdBy', 'firstName lastName').populate('category', 'name'); // Populate createdBy with user details
        if (incomes.length === 0) {
          return res.status(200).json({ message: "No incomes found" });
        }
        const result = incomes.map((item, index) => ({
          serialNumber: index + 1,
          ...item.toObject(),
        }));        
        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createIncome = async (req, res) => {
    try {
        const user = req.user; 
       if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
       }
        const { title, category, amount, description, source } = req.body;
        if (!title || !category || !amount) {
            return res.status(400).json({ message: "Title, category, and amount are required" });
        }
        const newIncome = new Income({
            title,
            description,
            category,
            amount,
            source,
            createdBy: req.user.id // Assuming req.user is set by authentication middleware
        });
        await newIncome.save();
        res.status(201).json(newIncome);
    } catch (error) {
        console.log("Error creating income:", error);
        res.status(500).json({ error: error.message });
    }
}
exports.findIncomeById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Income ID is required" });}
    try {
        const income = await Income.findById(req.params.id);
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

exports.deleteIncome = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Income ID is required" });
    }
    try {
        const income = await Income.findById(id);
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        await Income.findByIdAndDelete(id);
        res.status(200).json({ message: "Income deleted"  });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateIncome = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "Income ID is required" });
    }
    try {
        const income = await Income.findByIdAndUpdate(id, req.body, { new: true });
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }
        res.status(200).json(income);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}