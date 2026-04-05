import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import API from "../services/api";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ");
      return;
    }

    try {
      const res = await API.post("/login", {
        username,
        password,
      });

      const { token, role } = res.data;

      // lưu
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", res.data.username);
      localStorage.setItem("manv", res.data.manv);

      // phân quyền
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "nhanvien") {
        navigate("/");
      }
      window.location.reload();
    } catch (err) {
      // In lỗi thật ra F12 (Console) để dân Dev xem
      console.log(
        "CHI TIẾT LỖI TỪ BACKEND:",
        err.response?.data || err.message,
      );

      // Hiển thị lỗi thật lên màn hình thay vì câu mặc định
      const realError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Lỗi không thể kết nối tới Server!";
      setError(realError);
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Quản Lý Nhân Sự</h2>

        <input
          placeholder="Tên tài khoản"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button onClick={handleLogin}>Đăng nhập</button>
      </div>
    </div>
  );
}
