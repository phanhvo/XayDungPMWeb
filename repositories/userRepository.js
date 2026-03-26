const db = require("../config/db");
exports.findByCredentials = async (username, password) => {
  const result = await db.query(
    `SELECT * FROM taikhoan
     WHERE tentk = $1
     AND pass_hash = $2
     AND trangthai = 'hoạt động'`,
    [username, password]
  );

  return result.rows[0];
}
exports.getAllUsers = async () => {
  const [rows] = await db.query("SELECT * FROM users");
  return rows;
};

exports.getUserById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id=?",
    [id]
  );
  return rows[0];
};

exports.createUser = async (name) => {
  const [result] = await db.query(
    "INSERT INTO users(name) VALUES(?)",
    [name]
  );
  return result;
};

exports.updateUser = async (id, name) => {
  const [result] = await db.query(
    "UPDATE users SET name=? WHERE id=?",
    [name, id]
  );
  return result;
};

exports.deleteUser = async (id) => {
  const [result] = await db.query(
    "DELETE FROM users WHERE id=?",
    [id]
  );
  return result;
};