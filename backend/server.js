const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("CRUD USERS API is running");
});

app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", employeeRoutes);
app.use("/", dashboardRoutes);
app.use("/", departmentRoutes);
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
