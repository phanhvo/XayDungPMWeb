const db = require("../config/db");

exports.getSalaryByEmployee = async (manv) => {
  // Lấy thêm trường thang, nam từ kyluong để frontend dùng
  const result = await db.query(
    "SELECT *, EXTRACT(MONTH FROM kyluong) AS thang, EXTRACT(YEAR FROM kyluong) AS nam FROM luong WHERE manv = $1 ORDER BY kyluong DESC",
    [manv],
  );
  return result.rows;
};
