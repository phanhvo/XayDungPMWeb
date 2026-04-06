const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { verifyToken } = require("../middleware/authMiddleware");

// Các API này dành cho Employee (nhân viên đã đăng nhập)
router.get("/me", verifyToken, attendanceController.getMyAttendance);
router.post("/checkin", verifyToken, attendanceController.checkIn);
router.post("/checkout", verifyToken, attendanceController.checkOut);

module.exports = router;
