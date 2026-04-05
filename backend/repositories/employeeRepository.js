const db = require("../config/db");

exports.getEmployees = async (filters) => {
  const { search, chucvu, mapb, trangthai } = filters;
  let query = "SELECT * FROM nhanvien WHERE 1=1";
  const params = [];
  let paramIndex = 1;

  if (search) {
    query += ` AND (hotennv ILIKE $${paramIndex} OR manv ILIKE $${paramIndex})`;
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (chucvu) {
    query += ` AND chucvu = $${paramIndex}`;
    params.push(chucvu);
    paramIndex++;
  }

  if (mapb) {
    query += ` AND mapb = $${paramIndex}`;
    params.push(mapb);
    paramIndex++;
  }

  if (trangthai) {
    query += ` AND trangthai = $${paramIndex}`;
    params.push(trangthai);
    paramIndex++;
  }

  query += " ORDER BY manv ASC";

  const result = await db.query(query, params);
  return result.rows;
};

exports.getEmployeeById = async (manv) => {
  const result = await db.query(
    "SELECT * FROM nhanvien WHERE ma_nhan_vien = $1",
    [manv],
  );
  return result.rows[0];
};

exports.createEmployee = async (data) => {
  const {
    manv,
    hotennv,
    gioitinh,
    ngsinh,
    sdt,
    email,
    diachi,
    ngaybatdaulam,
    chucvu,
    trangthai,
    mapb,
  } = data;

  const check = await db.query("SELECT * FROM nhanvien WHERE manv = $1", [
    manv,
  ]);
  if (check.rows.length > 0) {
    throw new Error("Mã nhân viên đã tồn tại");
  }

  const result = await db.query(
    `INSERT INTO nhanvien (manv, hotennv, gioitinh, ngsinh, sdt, email, diachi, ngaybatdaulam, chucvu, trangthai, mapb) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      manv,
      hotennv,
      gioitinh,
      ngsinh,
      sdt,
      email,
      diachi,
      ngaybatdaulam,
      chucvu,
      trangthai,
      mapb,
    ],
  );
  return result.rows[0];
};

exports.updateEmployee = async (manv, data) => {
  const {
    hotennv,
    gioitinh,
    ngsinh,
    sdt,
    email,
    diachi,
    ngaybatdaulam,
    chucvu,
    trangthai,
    mapb,
  } = data;

  const result = await db.query(
    `UPDATE nhanvien 
         SET hotennv = COALESCE($1, hotennv), 
             gioitinh = COALESCE($2, gioitinh),
             ngsinh = COALESCE($3, ngsinh),
             sdt = COALESCE($4, sdt),
             email = COALESCE($5, email), 
             diachi = COALESCE($6, diachi),
             ngaybatdaulam = COALESCE($7, ngaybatdaulam),
             chucvu = COALESCE($8, chucvu), 
             trangthai = COALESCE($9, trangthai),
             mapb = COALESCE($10, mapb) 
         WHERE manv = $11 RETURNING *`,
    [
      hotennv,
      gioitinh,
      ngsinh,
      sdt,
      email,
      diachi,
      ngaybatdaulam,
      chucvu,
      trangthai,
      mapb,
      manv,
    ],
  );

  if (result.rows.length === 0) {
    throw new Error("Không tìm thấy nhân viên");
  }
  return result.rows[0];
};

exports.deleteEmployee = async (manv) => {
  const result = await db.query(
    "DELETE FROM nhanvien WHERE manv = $1 RETURNING *",
    [manv],
  );
  if (result.rows.length === 0) {
    throw new Error("Không tìm thấy nhân viên để xoá");
  }
};
