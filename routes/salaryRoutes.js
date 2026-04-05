const express = require("express");
const router = express.Router();
const salaryController = require("../controllers/salaryController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/luong/me", verifyToken, salaryController.getMySalary);

module.exports = router;
