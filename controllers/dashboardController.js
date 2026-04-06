const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Tổng nhân viên
    const totalNV = await db.query("SELECT COUNT(*) FROM nhanvien");
    
    // 2. Tổng phòng ban
    const totalPB = await db.query("SELECT COUNT(*) FROM phongban");
    
    // 3. Tổng quỹ lương
    const totalSalary = await db.query("SELECT SUM(luongcoban) FROM luong");
    
    // 4. ĐIỂM QUAN TRỌNG: Lấy số người đi làm theo ngày thực tế của hệ thống
    const attendanceToday = await db.query(
        "SELECT COUNT(*) FROM chamcong WHERE ngaylam = CURRENT_DATE AND (trangthai = 'đi làm' OR trangthai = 'đi trễ' OR trangthai = 'tăng ca')"
    );

    // 5. 5 nhân viên mới nhất
    const recentNV = await db.query(
        "SELECT manv, hotennv, chucvu, ngaybatdaulam, trangthai FROM nhanvien ORDER BY ngaybatdaulam DESC LIMIT 5"
    );

    res.json({
      totalEmployees: parseInt(totalNV.rows[0].count),
      totalDepartments: parseInt(totalPB.rows[0].count),
      totalSalary: parseFloat(totalSalary.rows[0].sum || 0),
      attendanceToday: parseInt(attendanceToday.rows[0].count),
      recentEmployees: recentNV.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi Server" });
  }
};
