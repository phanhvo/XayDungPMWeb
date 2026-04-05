const db = require("../config/db");

exports.getSalaryByEmployee = async (manv) => {
  // Dựa theo bảng luong [cite: 6]
  const result = await db.query(
    "SELECT * FROM luong WHERE ma_nhan_vien = $1 ORDER BY nam DESC, thang DESC",
    [manv],
  );
  return result.rows;
};
