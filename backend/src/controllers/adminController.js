const Income = require("../models/IncomeModel");
const Expense = require("../models/ExpensesModel");
const Inventory = require("../models/InventoryModel");

let data = {}
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch total income
    Income.getTotal()
      .then((total) => data.income = total)
      .catch((error) => console.log(error));

    // Fetch total expenses
     Expense.getTotal()
      .then((total) => (data.expense = total))
      .catch((error) => console.log(error));
    
    Inventory.getTotal().then(
        (total) =>{
          data.costPriceTotal = total.costPriceTotal;
          data.sellingPriceTotal = total.sellingPriceTotal;
        } 
      );

    res.json({... data,
      business_name:  "Zijag Hub"
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
};
