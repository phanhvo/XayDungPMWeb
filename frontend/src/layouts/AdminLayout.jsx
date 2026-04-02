import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";
// Import các icon từ thư viện (dùng bộ Lucide cho hiện đại)
import { LuLayoutDashboard, LuBuilding2, LuUsers, LuUserCog, LuMenu, LuLogOut } from "react-icons/lu";

// pages
import Dashboard from "../pages/admin/Dashboard";
import AdminEmployeeManager from "../pages/admin/Employee";
import Accounts from "../pages/admin/Account";
import Departments from "../pages/admin/Department";
import "../styles/admin.css";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* SIDEBAR */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <h2 className="logo">{collapsed ? "A" : "Admin"}</h2>
        </div>

        <div className="sidebar-menu">
          <Link to="/admin">
            <LuLayoutDashboard className="icon" />
            <span className="text">Dashboard</span>
          </Link>
          <Link to="/admin/departments">
            <LuBuilding2 className="icon" />
            <span className="text">Phòng ban</span>
          </Link>
          <Link to="/admin/employees">
            <LuUsers className="icon" />
            <span className="text">Nhân viên</span>
          </Link>
          <Link to="/admin/accounts">
            <LuUserCog className="icon" />
            <span className="text">Tài khoản</span>
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">
        {/* HEADER */}
        <div className="header">
          <button className="btn-toggle" onClick={() => setCollapsed(!collapsed)}>
            <LuMenu />
          </button>

          <button className="btn btn-logout" onClick={handleLogout}>
            <LuLogOut size={18} />
            <span>Đăng xuất</span>
          </button>
        </div>

        {/* MAIN */}
        <div className="main">
          <div className="main-content-box">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="departments" element={<Departments />} />
              <Route path="employees" element={<AdminEmployeeManager />} />
              <Route path="accounts" element={<Accounts />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}
