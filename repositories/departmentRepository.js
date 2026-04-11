const db = require("../config/db");

exports.getAllDepartments = async () => {
    const result = await db.query("SELECT * FROM phongban ORDER BY mapb ASC");
    return result.rows;
};

exports.getDepartmentById = async (mapb) => {
    const result = await db.query("SELECT * FROM phongban WHERE mapb = $1", [mapb]);
    return result.rows[0];
};

exports.createDepartment = async (data) => {
    const { mapb, tenpban, mota } = data;
    
    const check = await db.query("SELECT * FROM phongban WHERE mapb = $1", [mapb]);
    if (check.rows.length > 0) throw new Error("Mã phòng ban đã tồn tại");

    const result = await db.query(
        "INSERT INTO phongban (mapb, tenpban, mota ) VALUES ($1, $2, $3) RETURNING *",
        [mapb, tenpban, mota]
    );
    return result.rows[0];
};

exports.updateDepartment = async (mapb, data) => {
    const { tenpban, mota } = data;
    // matp không được dùng COALESCE để có thể cập nhật về NULL khi Admin chọn "Trống"
    const result = await db.query(
        `UPDATE phongban 
         SET tenpban = COALESCE($1, tenpban), 
             mota = COALESCE($2, mota), 
             matp = $3 
         WHERE mapb = $4 RETURNING *`,
        [tenpban, mota, matp, mapb]
    );
    return result.rows[0];
};

exports.deleteDepartment = async (mapb) => {
    const result = await db.query("DELETE FROM phongban WHERE mapb = $1 RETURNING *", [mapb]);
    if (result.rows.length === 0) throw new Error("Không tìm thấy phòng ban để xóa");
};

exports.assignEmployeesToDepartment = async (mapb, manvList) => {
    const result = await db.query(
        "UPDATE nhanvien SET mapb = $1 WHERE manv = ANY($2::varchar[]) RETURNING manv, hotennv, mapb",
        [mapb, manvList]
    );
    return result.rows;
};