const employeeRepository = require("../repositories/employeeRepository");
const userRepository = require("../repositories/userRepository");
const db = require("../config/db");
exports.getEmployees = async (filters) => {
    return await employeeRepository.getEmployees(filters);
};

exports.getEmployeeById = async (manv) => {
    return await employeeRepository.getEmployeeById(manv);
};

exports.createEmployee = async (data) => {
    try {
        await db.query('BEGIN'); // Sử dụng transaction để đảm bảo an toàn dữ liệu

        // 1. Tạo nhân viên mới
        const newEmp = await employeeRepository.createEmployee(data);

        // 2. Logic chuyển đổi mã: NV01 -> TK01
        // Dùng replace để thay 'NV' (hoặc 'nv') thành 'TK'
        const tenTaiKhoan = data.manv.toUpperCase().replace('NV', 'TK');

        const userData = {
            tentk: tenTaiKhoan,     // Tên tài khoản mới (ví dụ: TK01)
            pass: "123",            // Mật khẩu mặc định
            phanquyen: "nhanvien",  // Quyền mặc định
            manv: data.manv         // Liên kết với mã nhân viên gốc
        };
        
        await userRepository.createUser(userData);

        await db.query('COMMIT');
        return newEmp;
    } catch (err) {
        await db.query('ROLLBACK');
        throw err;
    }
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