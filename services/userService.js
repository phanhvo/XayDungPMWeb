const db = require("../config/db");
const jwt = require("jsonwebtoken");
exports.login = async (username, password) => {
  const result = await db.query(
    `SELECT * FROM taikhoan
     WHERE tentk = $1
     AND pass_hash = $2
     AND trangthai = 'hoạt động'`,
    [username, password]
  );

  const user = result.rows[0];

  if (!user) {
    throw new Error("Sai tài khoản hoặc mật khẩu");
  }

  const token = jwt.sign(
    {
      id: user.ma_tai_khoan,
      role: user.phanquyen,
      ma_nhan_vien: user.ma_nhan_vien
    },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1d" }
  );

  return {
    token,
    role: user.phanquyen,
    username: user.tentk
  };
};
exports.getAllUsers = async () => {
  const result = await db.query(
    "SELECT * FROM users ORDER BY id"
  );
  return result.rows;
};

exports.getUserById = async (id) => {
  const result = await db.query(
    "SELECT * FROM users WHERE id=$1",
    [id]
  );
  return result.rows[0];
};

exports.createUser = async (name) => {
  const result = await db.query(
    "INSERT INTO users(name) VALUES($1) RETURNING *",
    [name]
  );
  return result.rows[0];
};

exports.updateUser = async (id, name) => {
  const result = await db.query(
    "UPDATE users SET name=$1 WHERE id=$2 RETURNING *",
    [name, id]
  );
  return result.rows[0];
};

exports.deleteUser = async (id) => {
  await db.query(
    "DELETE FROM users WHERE id=$1",
    [id]
  );
};