const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Tổng nhân viên (Trừ những người đã nghỉ việc)
    const empResult = await db.query(
      "SELECT COUNT(*) FROM nhanvien WHERE trangthai != 'Nghỉ việc'",
    );
    const totalEmployees = parseInt(empResult.rows[0].count);

    // 2. Tổng phòng ban
    const deptResult = await db.query("SELECT COUNT(*) FROM phongban");
    const totalDepartments = parseInt(deptResult.rows[0].count);

    // 3. Tổng quỹ lương cơ bản
    const salaryResult = await db.query(
      "SELECT SUM(luongcoban) FROM nhanvien WHERE trangthai != 'Nghỉ việc'",
    );
    const totalSalary = parseInt(salaryResult.rows[0].sum) || 0;

    // 4. Số người đi làm hôm nay (Sửa đúng tên cột là ngaylam và ma_nhan_vien)
    const attendanceResult = await db.query(
      "SELECT COUNT(DISTINCT ma_nhan_vien) FROM chamcong WHERE DATE(ngaylam) = CURRENT_DATE",
    );
    const attendanceToday = parseInt(attendanceResult.rows[0].count);

    // 5. 5 nhân viên mới gia nhập gần nhất (Sửa đúng tên cột ma_nhan_vien)
    const recentEmpResult = await db.query(
      `SELECT ma_nhan_vien AS manv, hotennv, chucvu, ngaybatdaulam, trangthai 
             FROM nhanvien 
             ORDER BY ngaybatdaulam DESC NULLS LAST 
             LIMIT 5`,
    );

    // Trả kết quả về cho Frontend
    res.json({
      totalEmployees,
      totalDepartments,
      totalSalary,
      attendanceToday,
      recentEmployees: recentEmpResult.rows,
    });
  } catch (err) {
    console.error("Chi tiết lỗi Dashboard:", err);
    res.status(500).json({ error: "Lỗi máy chủ khi lấy dữ liệu Dashboard" });
  }
};
