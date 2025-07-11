
// Import Required Modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
dotenv.config({ path: "../../.env" });



const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());
// Enable files upload
app.use(fileUpload());
// Test Route
app.get("/", (req, res) => {
    res.json({ message: "University CBT App Backend is Running!" });
});

// Import Routes
const authRoutes = require("./routes/AuthRoutes");
const IncomeRoutes = require("./routes/IncomeRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const ExpenseRoutes = require("./routes/ExpenseRoutes");
const InventoryRoutes = require("./routes/InventoryRoutes");
const ReportRoutes = require("./routes/ReportRoutes");
const SalesRoutes = require("./routes/SalesRoutes");



const adminRoutes = require("./routes/AdminRoutes");



app.use("/api/auth", authRoutes);
app.use("/api/incomes", IncomeRoutes); // Income Routes
app.use("/api/categories", CategoryRoutes); // Category Routes
app.use("/api/expenses", ExpenseRoutes); // Expense Routes
app.use("/api/inventories", InventoryRoutes); // Inventory Routes
app.use("/api/reports", ReportRoutes); // Report Routes
app.use("/api/sales", SalesRoutes); // Sales Routes
// Admin Routes
app.use("/api/admin", adminRoutes);


app.all("*", (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.status(404).json({
    code: 404,
    status: "Not found",
    message: `Can not find ${fullUrl} on this server`,
  });
});


module.exports = app;
