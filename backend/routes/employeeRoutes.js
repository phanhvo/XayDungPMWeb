const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/nhanvien", verifyToken, employeeController.getEmployees);
router.get("/nhanvien/:manv", verifyToken, employeeController.getEmployeeById);

router.post("/nhanvien", verifyToken, isAdmin, employeeController.createEmployee);
router.put("/nhanvien/:manv", verifyToken, isAdmin, employeeController.updateEmployee);
router.delete("/nhanvien/:manv", verifyToken, isAdmin, employeeController.deleteEmployee);

module.exports = router;