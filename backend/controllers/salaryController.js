const salaryService = require("../services/salaryService");

exports.getMySalary = async (req, res) => {
  try {
    const data = await salaryService.getMySalary(req.user.manv);
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy lương:", err); // Thêm log chi tiết
    res.status(500).json({ error: err.message });
  }
};
