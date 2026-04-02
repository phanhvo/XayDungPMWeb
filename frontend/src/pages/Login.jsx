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

      // phân quyền
      if (role === "admin") {
        navigate("/admin");
      } else if (role === "nhanvien") {
        navigate("/");
      }

    } catch (err) {
      setError("Sai tài khoản hoặc mật khẩu");
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập</h2>

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