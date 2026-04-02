import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

// pages (tạo sau)
import Dashboard from "../pages/admin/Dashboard";
import Employees from "../pages/admin/Employee";
import Accounts from "../pages/admin/Account";
import "../styles/admin.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  }

  return (
    <div className="container">

      {/* SIDEBAR */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <h2 className="h2">{collapsed ? "A" : "Admin"}</h2>

        <Link to="/admin">🏠 {collapsed ? "" : "Dashboard"}</Link>
        <Link to="/admin/employees">👨‍💼 {collapsed ? "" : "Nhân viên"}</Link>
        <Link to="/admin/accounts">👤 {collapsed ? "" : "Quản lý tài khoản"}</Link>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* HEADER */}
        <div className="header">
          <button onClick={() => setCollapsed(!collapsed)}>☰</button>

          <button className="btn btn-logout" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>

        {/* MAIN */}
        <div className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="accounts" element={<Accounts />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}