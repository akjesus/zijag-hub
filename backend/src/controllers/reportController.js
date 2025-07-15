const Income = require("../models/IncomeModel");
const Expense = require("../models/ExpensesModel");
const Inventory = require("../models/InventoryModel");
const Sales = require("../models/SalesModel");
const Category = require('../models/CategoryModel')


exports.getSummaryReport = async (req, res) => {
  const { startDate, endDate } = req.query;
	const start = new Date(startDate);
	const end = new Date(endDate);
	end.setHours(23, 59, 59, 999);
  const [incomeData, expenseData] = await Promise.all([
		Income.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
					},
					income: { $sum: "$amount" },
				},
			},
		]),
		Expense.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
					},
					expense: { $sum: "$amount" },
				},
			},
		]),
	]);

	// Merge the income and expense results by date
	const resultMap = {};

	incomeData.forEach((item) => {
		resultMap[item._id] = { date: item._id, income: item.income, expense: 0 };
	});

	expenseData.forEach((item) => {
		if (resultMap[item._id]) {
			resultMap[item._id].expense = item.expense;
		} else {
			resultMap[item._id] = {
				date: item._id,
				income: 0,
				expense: item.expense,
			};
		}
	});

	// Sort by date
	const mergedResults = Object.values(resultMap).sort(
		(a, b) => new Date(a.date) - new Date(b.date)
  );
  if (!mergedResults.length)
    return res.status(404).json({ error: "No data for this date range" })
	return res.status(200).json(mergedResults);
};

exports.salesReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate);
	const end = new Date(endDate);
	end.setHours(23, 59, 59, 999);

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }
  try {
    const best = await Sales.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: "$description",
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { totalAmount: -1 },
			},
			{
				$limit: 3,
			},
		]);
    const worst = await Sales.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: "$description",
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { totalAmount: 1 },
			},
			{
				$limit: 3,
			},
		]);
    const totalSales = await Sales.getTotal();
    const cat = await Sales.aggregate([
			{
				$match: {
					createdAt: { $gte: start, $lte: end },
				},
			},
			{
				$group: {
					_id: "$category",
					totalAmount: { $sum: "$amount" },
					count: { $sum: 1 },
				},
			},
			{
				$sort: { totalAmount: -1 },
			},
			{
				$limit: 3,
			},
    ]);
    if (!cat.length) {
      return res.status(404).json({ error: "No data for this date range" });
    }
    const bestSellingCat = await Category.findById(cat);

    //calculate sales from best selling category
    
    res.status(200).json({
      best,
      worst,
      totalSales,
      bestSellingCategory: bestSellingCat.name,
      categoryTotalsales: cat[0].totalAmount,
      categorySalesCount: cat[0].count
    });
  } catch (error) {
    console.log("Error fetching best selling items:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.incomeReport = async (req, res) => {
  const { startDate, endDate } = req.query;
  const start = new Date(startDate);
	const end = new Date(endDate);
	end.setHours(23, 59, 59, 999);
  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Start date and end date are required" });
  }
  const result = await Income.aggregate([
		{
			$match: {
				createdAt: { $gte: start, $lte: end },
			},
		},

		{
			$group: {
				_id: "$source",
				totalIncome: {
					$sum: "$amount",
				},
			},
		},
		{
			$limit: 3,
		},
	]);
if (!result.length) {
	return res.status(404).json({ error: "No data for this date range" });
}
return res.json(result);
}

exports.expenseReport = async(req, res)=> {
 const { startDate, endDate } = req.query;
 const start = new Date(startDate);
 const end = new Date(endDate);
 end.setHours(23, 59, 59, 999);
 console.log(startDate, endDate);
 if (!startDate || !endDate) {
		return res
			.status(400)
			.json({ message: "Start date and end date are required" });
 }
 const result = await Expense.aggregate([
		{
			$match: {
				createdAt: { $gte: start, $lte: end },
			},
		},

		{
			$group: {
				_id: "$source",
				totalExpenses: {
					$sum: "$amount",
				},
			},
		},
		{
			$limit: 3,
		},
 ]);
if (!result.length) {
	return res.status(404).json({ error: "No data for this date range" });
}
 return res.json(result);

}

exports.getDailyItemsAndTotals = async (req, res) => {
	const { startDate, endDate } = req.query;
	console.log(startDate, endDate);
	if ((!startDate || !endDate))
		return res.status(400).json({ error: "Invalid Date" });
  const start = new Date(startDate);
	const end = new Date(endDate);
	end.setHours(23, 59, 59, 999);

	// Fetch all incomes and expenses in range
	const [incomes, expenses] = await Promise.all([
		Income.find({ createdAt: { $gte: start, $lte: end } }),
		Expense.find({ createdAt: { $gte: start, $lte: end } }),
	]);

	// Helper to format date as YYYY-MM-DD
	const formatDate = (date) => new Date(date).toISOString().slice(0, 10);

	// Group data by day
	const reportMap = {};

	incomes.forEach((item) => {
		const date = formatDate(item.createdAt);
		if (!reportMap[date]) {
			reportMap[date] = {
				date,
				incomes: [],
				expenses: [],
				totalIncome: 0,
				totalExpense: 0,
			};
		}
		reportMap[date].incomes.push(item);
		reportMap[date].totalIncome += item.amount;
	});

	expenses.forEach((item) => {
		const date = formatDate(item.createdAt);
		if (!reportMap[date]) {
			reportMap[date] = {
				date,
				incomes: [],
				expenses: [],
				totalIncome: 0,
				totalExpense: 0,
			};
		}
		reportMap[date].expenses.push(item);
		reportMap[date].totalExpense += item.amount;
	});

	// Add net total and convert to sorted array
	const dailyReport = Object.values(reportMap)
		.map((day) => ({
			...day,
			netTotal: day.totalIncome - day.totalExpense,
		}))
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	// return dailyReport;
  return res.status(200).json({
		dailyReport,
	});
}