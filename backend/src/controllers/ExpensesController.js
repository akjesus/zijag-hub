const Expenses = require("../models/ExpensesModel");



exports.getAllExpense = async (req, res)=> {
    try {
        const expenses = await Expenses.find()
          .sort({ date: -1 })
          .populate("createdBy", "firstName lastName")
          .populate("category", "name"); // Populate createdBy with user detail
        if (expenses.length === 0) {
            return res.status(200).json({ message: "No expenses found" });
        }
        const result = expenses.map((item, index) => ({
          serialNumber: index + 1,
          ...item.toObject(),
        }));
        return res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.createExpense = async (req, res) => {
    try {
        const user = req.user; 
       if (!user) {
            return res.status(401).json({ message: "Unauthorized" });
       }
        const { title, category, amount, description, source } = req.body;
        if (!title || !category || !amount) {
            return res.status(400).json({ message: "Title, category, and amount are required" });
        }
        const newExpense= new Expenses({
          title,
          description,
          category,
          amount,
          source,
          createdBy: req.user.id, // Assuming req.user is set by authentication middleware
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        console.log("Error creating expenses:", error);
        res.status(500).json({ error: error.message });
    }
}
exports.findExpenseById = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "expense ID is required" });}
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}   

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "expense ID is required" });
    }
    try {
        const expense = await Expenses.findById(id);
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        await Expenses.findByIdAndDelete(id);
        res.status(200).json({ message: "expense deleted"  });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

exports.updateExpenses = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ message: "expense ID is required" });
    }
    try {
        const expense = await Expenses.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        if (!expense) {
            return res.status(404).json({ message: "expense not found" });
        }
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}