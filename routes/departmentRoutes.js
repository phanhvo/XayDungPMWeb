const express = require("express");
const router = express.Router();
const departmentController = require("../controllers/departmentController");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");

router.get("/phongban", verifyToken, departmentController.getAllDepartments);
router.get("/phongban/:mapb/history", verifyToken, departmentController.getHistory);router.post("/phongban", verifyToken, isAdmin, departmentController.createDepartment);
router.put("/phongban/:mapb", verifyToken, isAdmin, departmentController.updateDepartment);
router.delete("/phongban/:mapb", verifyToken, isAdmin, departmentController.deleteDepartment);

router.post("/phongban/:mapb/assign", verifyToken, isAdmin, departmentController.assignEmployees);

module.exports = router;