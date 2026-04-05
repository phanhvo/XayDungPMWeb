const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const { verifyToken } = require("../middleware/authMiddleware");

// Các API này dành cho Employee (nhân viên đã đăng nhập)
router.get("/chamcong/me", verifyToken, attendanceController.getMyAttendance);
router.post("/chamcong/checkin", verifyToken, attendanceController.checkIn);
router.post("/chamcong/checkout", verifyToken, attendanceController.checkOut);

module.exports = router;
