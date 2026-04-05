const jwt = require("jsonwebtoken");
const authRepository = require("../repositories/authRepository");

// LOGIN
exports.login = async (username, password) => {
  const user = await authRepository.getByUsername(username);

  if (!user) {
    throw new Error("Tài khoản không tồn tại");
  }

  if (user.trangthai !== "hoạt động") {
    throw new Error("Tài khoản đã bị khoá");
  }

  // 🔥 SỬA: Đổi user.pass thành user.pass_hash
  if (user.pass_hash !== password) {
    throw new Error("Sai mật khẩu");
  }

  const token = jwt.sign(
    {
      username: user.tentk,
      role: user.phanquyen,
      // 🔥 SỬA: Đổi user.manv thành user.ma_nhan_vien
      manv: user.ma_nhan_vien,
    },
    process.env.JWT_SECRET || "SECRET_KEY",
    { expiresIn: "1d" },
  );

  return {
    token,
    role: user.phanquyen,
    username: user.tentk,
    // 🔥 SỬA: Đổi user.manv thành user.ma_nhan_vien
    manv: user.ma_nhan_vien,
  };
};

// GET ALL
exports.getAllAccounts = async () => {
  return await authRepository.getAllAccounts();
};

// CREATE
exports.createAccount = async (data) => {
  return await authRepository.createAccount(data);
};

// UPDATE
exports.updateAccount = async (tentk, data) => {
  return await authRepository.updateAccount(tentk, data);
};

// DELETE
exports.deleteAccount = async (tentk) => {
  return await authRepository.deleteAccount(tentk);
};
