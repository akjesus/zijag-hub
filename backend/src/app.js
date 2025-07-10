
// Import Required Modules
const express = require("express");
const mongoose = require("mongoose");
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
const authRoutes = require("./routes/authRoutes");
const IncomeRoutes = require("./routes/IncomeRoutes");
const CategoryRoutes = require("./routes/CategoryRoutes");
const ExpenseRoutes = require("./routes/ExpenseRoutes");
const InventoryRoutes = require("./routes/InventoryRoutes");


const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const semesterRoutes = require("./routes/semesterRoutes");
const facultyDepartmentRoutes = require("./routes/facultyDepartmentRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const departmentCourseRoutes = require("./routes/departmentCourseRoutes");
const departmentStudentRoutes = require("./routes/departmentStudentRoutes");
const departmentStaffRoutes = require("./routes/departmentStaffRoutes");
const courseRoutes = require("./routes/courseRoutes");
const courseExamRoutes = require("./routes/courseExamRoutes");
const studentRoutes = require("./routes/studentRoutes");
const studentResultRoutes = require("./routes/studentResultRoutes");
const staffRoutes = require("./routes/staffRoutes");
const examResultsRoutes = require("./routes/examResultsRoutes");
const examRoutes = require("./routes/examRoutes");
const examDepartmentRoutes = require("./routes/examDepartmentRoutes");
const questionRoutes = require("./routes/questionRoutes");
const carryoverCourseRoutes = require("./routes/carryoverCourseRoutes");
const examTakingRoutes = require("./routes/examTakingRoutes");
const resultProcessingRoutes = require("./routes/resultProcessingRoutes");
const studentBulkRoutes = require("./routes/studentBulkRoutes");
const eligibleExamRoutes = require("./routes/eligibleExamRoutes");
const examExaminerRoutes = require("./routes/examExaminerRoutes");
const examQuestionRoutes = require("./routes/examQuestionRoutes");
const resultRoutes = require("./routes/resultRoutes");
const reportRoutes = require("./routes/reportRoutes");



app.use("/api/auth", authRoutes);
app.use("/api/incomes", IncomeRoutes); // Income Routes
app.use("/api/categories", CategoryRoutes); // Category Routes
app.use("/api/expenses", ExpenseRoutes); // Expense Routes
app.use("/api/inventories", InventoryRoutes); // Inventory Routes


app.use("/api/admin", adminRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/semesters", semesterRoutes);
app.use("/api/faculty-departments", facultyDepartmentRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/department-courses", departmentCourseRoutes);
app.use("/api/department-students", departmentStudentRoutes);
app.use("/api/department-staffs", departmentStaffRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/student-results", studentResultRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/exam-results", examResultsRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/exam-departments", examDepartmentRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/carryover-courses", carryoverCourseRoutes);
app.use("/api/exam-taking", examTakingRoutes);
app.use("/api/results", resultProcessingRoutes);
app.use("/api/student", studentBulkRoutes);
app.use("/api/result", resultRoutes);
app.use("/api/reports", reportRoutes);

app.all("*", (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  res.status(404).json({
    code: 404,
    status: "Not found",
    message: `Can not find ${fullUrl} on this server`,
  });
});


module.exports = app;
