const salaryService = require("../services/salaryService");

exports.getMySalary = async (req, res) => {
  try {
    const data = await salaryService.getMySalary(req.user.manv);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
