const db = require("../config/db");

exports.getAttendanceByEmployee = async (manv) => {
  // Lấy lịch sử chấm công của một nhân viên
  const result = await db.query(
    "SELECT * FROM chamcong WHERE ma_nhan_vien = $1 ORDER BY ngaylam DESC",
    [manv],
  );
  return result.rows;
};

exports.getTodayAttendance = async (manv, date) => {
  const result = await db.query(
    "SELECT * FROM chamcong WHERE ma_nhan_vien = $1 AND ngaylam = $2",
    [manv, date],
  );
  return result.rows[0];
};

exports.checkIn = async (data) => {
  const { ma_cham_cong, ngaylam, checkin, trangthai, ma_nhan_vien } = data;
  const result = await db.query(
    `INSERT INTO chamcong (ma_cham_cong, ngaylam, checkin, trangthai, ma_nhan_vien) 
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [ma_cham_cong, ngaylam, checkin, trangthai, ma_nhan_vien],
  );
  return result.rows[0];
};

exports.checkOut = async (ma_cham_cong, data) => {
  const { checkout, tonggiolam, trangthai } = data;
  const result = await db.query(
    `UPDATE chamcong 
         SET checkout = $1, tonggiolam = $2, trangthai = $3 
         WHERE ma_cham_cong = $4 RETURNING *`,
    [checkout, tonggiolam, trangthai, ma_cham_cong],
  );
  return result.rows[0];
};
