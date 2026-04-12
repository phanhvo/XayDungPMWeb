const db = require("../config/db");

exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.query("SELECT * FROM users WHERE id=?", [id]);
  return rows[0];
};

exports.createUser = async (userData) => {
    const { tentk, pass, phanquyen, manv } = userData;
    // Sử dụng cú pháp $1, $2... của thư viện pg
    const result = await db.query(
        `INSERT INTO taikhoan (tentk, pass, phanquyen, trangthai, manv) 
         VALUES ($1, $2, $3, 'hoạt động', $4) RETURNING *`,
        [tentk, pass, phanquyen, manv]
    );
    return result.rows[0];
};

exports.updateUser = async (id, name) => {
  const [result] = await db.query("UPDATE users SET name=? WHERE id=?", [
    name,
    id,
  ]);
  return result;
};

exports.deleteUser = async (id) => {
  const [result] = await db.query("DELETE FROM users WHERE id=?", [id]);
  return result;
};
