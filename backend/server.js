const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");

// Import các file routes hiện có
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// 🔥 1. THÊM 2 DÒNG NÀY: Import file route Chấm Công và Lương
const attendanceRoutes = require("./routes/attendanceRoutes");
const salaryRoutes = require("./routes/salaryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("CRUD USERS API is running");
});

// Đăng ký các routes hiện có
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", employeeRoutes);
app.use("/", dashboardRoutes);
app.use("/", departmentRoutes);

app.use("/chamcong", attendanceRoutes);
app.use("/luong", salaryRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
