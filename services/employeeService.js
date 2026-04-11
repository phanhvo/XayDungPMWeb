const employeeRepository = require("../repositories/employeeRepository");
const db = require("../config/db");
exports.getEmployees = async (filters) => {
    return await employeeRepository.getEmployees(filters);
};

exports.getEmployeeById = async (manv) => {
    return await employeeRepository.getEmployeeById(manv);
};

exports.createEmployee = async (data) => {
    if (!data.manv || !data.hotennv) {
        throw new Error("Mã nhân viên và Họ tên nhân viên là bắt buộc");
    }
    return await employeeRepository.createEmployee(data);
};

exports.updateEmployee = async (manv, data) => {
    return await employeeRepository.updateEmployee(manv, data);
};

exports.deleteEmployee = async (manv) => {
    return await employeeRepository.deleteEmployee(manv);
};

exports.softDeleteEmployee = async (manv) => {
    try {
        await db.query('BEGIN'); // Dùng transaction cho an toàn

        // 1. Kiểm tra Trưởng phòng (Logic chặn)
        const checkLeader = await db.query(
            "SELECT mapb, tenpban FROM phongban WHERE matp = $1",
            [manv]
        );

        if (checkLeader.rowCount > 0) {
            throw new Error(`Không thể cho nghỉ việc vì nhân viên này đang là Trưởng phòng của [${checkLeader.rows[0].tenpban}].`);
        }

        // 2. Cập nhật nhân viên: Nghỉ việc + Gỡ phòng + Gỡ chức vụ
        await db.query(
            "UPDATE nhanvien SET trangthai = 'Nghỉ việc', chucvu = 'Nhân viên' WHERE manv = $1",
            [manv]
        );

        // 3. Khóa tài khoản
        await db.query(
            "UPDATE taikhoan SET trangthai = 'khoá' WHERE manv = $1",
            [manv]
        );

        await db.query('COMMIT');
        return true;
    } catch (err) {
        await db.query('ROLLBACK');
        throw err; // Ném lỗi này để Controller bắt được
    }
};