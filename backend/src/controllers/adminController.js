const Income = require("../models/IncomeModel");
const Expense = require("../models/ExpensesModel");
const Inventory = require("../models/InventoryModel");
const Users = require("../models/UserModel");
const Sales = require("../models/SalesModel");

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
      //get user count
    const userCount = await Users.countDocuments();
    data.userCount = userCount;

    // get total sales amount
    const totalSales = await Sales.getTotal();
    data.totalSales = totalSales;

    res.json({... data,
      business_name:  "Zijag Hub"
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
};
