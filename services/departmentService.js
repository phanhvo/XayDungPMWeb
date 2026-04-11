const departmentRepository = require("../repositories/departmentRepository");
const db = require("../config/db");
const moment = require('moment-timezone');

exports.getAllDepartments = async () => {
    return await departmentRepository.getAllDepartments();
};

exports.getDepartmentById = async (mapb) => {
    return await departmentRepository.getDepartmentById(mapb);
};

exports.createDepartment = async (data) => {
    if (!data.mapb || !data.tenpban) {
        throw new Error("Mã và tên phòng ban là bắt buộc");
    }
    return await departmentRepository.createDepartment(data);
};

exports.updateDepartment = async (mapb, data) => {
    return await departmentRepository.updateDepartment(mapb, data);
};

exports.deleteDepartment = async (mapb) => {
    return await departmentRepository.deleteDepartment(mapb);
};

exports.assignEmployeesToDepartment = async (mapb, manvList, matp) => {
    // 1. Khai báo biến chuẩn hóa ngay đầu hàm
    const cleanMapb = mapb.trim().toUpperCase();
    const leaderValue = (matp === "" || matp === null || matp === undefined) ? null : matp.trim().toUpperCase();
    
    // 2. Lấy giờ Việt Nam chuẩn GMT+7
    const gioVietNam = moment().tz("Asia/Ho_Chi_Minh").format("YYYY-MM-DD HH:mm:ss");

    console.log(`--- ĐANG THỰC THI GÁN NHÂN SỰ & LỊCH SỬ (Giờ VN: ${gioVietNam}) ---`);
    
    try {
        await db.query('BEGIN');

        // 3. Lấy thông tin Trưởng phòng hiện tại
        const oldDeptData = await db.query(
            "SELECT matp FROM phongban WHERE UPPER(TRIM(mapb)) = $1", 
            [cleanMapb]
        );
        
        if (oldDeptData.rowCount === 0) {
            throw new Error(`Không tìm thấy phòng ban [${cleanMapb}]`);
        }
        
        const oldLeader = oldDeptData.rows[0].matp;

        // 4. Kiểm tra trạng thái nhân viên được bổ nhiệm (Chặn người nghỉ việc)
        if (leaderValue) {
            const checkEmp = await db.query(
                "SELECT trangthai, hotennv FROM nhanvien WHERE manv = $1",
                [leaderValue]
            );

            if (checkEmp.rowCount === 0) {
                throw new Error(`Nhân viên mã [${leaderValue}] không tồn tại.`);
            }

            const emp = checkEmp.rows[0];
            if (emp.trangthai === 'Nghỉ việc' || emp.trangthai === 'nghỉ việc') {
                throw new Error(`Không thể bổ nhiệm [${emp.hotennv}] làm Trưởng phòng vì nhân viên này đã nghỉ việc!`);
            }
        }

        // 5. Cập nhật mã trưởng phòng mới vào bảng phongban
        await db.query(
            "UPDATE phongban SET matp = $1 WHERE UPPER(TRIM(mapb)) = $2",
            [leaderValue, cleanMapb]
        );

        // 6. Logic xử lý lịch sử chức vụ (Dùng gioVietNam)
        if (oldLeader !== leaderValue) {
            // A. Cập nhật ngày kết thúc cho sếp cũ
            if (oldLeader) {
                await db.query(
                    `UPDATE lichsuchucvu 
                     SET ngayketthuc = $1 
                     WHERE mapb = $2 AND manv = $3 AND ngayketthuc IS NULL`,
                    [gioVietNam, cleanMapb, oldLeader]
                );
            }

            // B. Thêm dòng mới cho sếp mới
            if (leaderValue) {
                await db.query(
                    `INSERT INTO lichsuchucvu (mapb, manv, ngaybatdau) 
                     VALUES ($1, $2, $3)`,
                    [cleanMapb, leaderValue, gioVietNam]
                );
            }
        }

        // 7. Cập nhật phòng ban cho danh sách nhân viên được tick
        if (manvList && manvList.length > 0) {
            await db.query(
                "UPDATE nhanvien SET mapb = $1 WHERE manv = ANY($2::varchar[])",
                [cleanMapb, manvList]
            );
        }

        // 8. Cập nhật chức danh hiển thị
        if (leaderValue) {
            await db.query("UPDATE nhanvien SET chucvu = 'Trưởng phòng' WHERE manv = $1", [leaderValue]);
            await db.query("UPDATE nhanvien SET chucvu = 'Nhân viên' WHERE mapb = $1 AND manv != $2", [cleanMapb, leaderValue]);
        }

        await db.query('COMMIT');
        return true;
    } catch (err) {
        await db.query('ROLLBACK');
        console.error("LỖI KHI GÁN NHÂN SỰ:", err.message);
        throw err; 
    }
};