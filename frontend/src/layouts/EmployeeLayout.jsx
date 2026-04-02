import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useState } from "react";

// pages
import Profile from "../pages/employee/Profile";
import Attendance from "../pages/employee/Attendance";
import Salary from "../pages/employee/Salary";

import "../styles/admin.css";

export default function EmployeeLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">

      {/* SIDEBAR */}
      <div className={`sidebar employee ${collapsed ? "collapsed" : ""}`}>
        <h2 className="h2">{collapsed ? "E" : "Employee"}</h2>

        <Link to="/">👤 {collapsed ? "" : "Profile"}</Link>
        <Link to="/attendance">📅 {collapsed ? "" : "Chấm công"}</Link>
        <Link to="/salary">💰 {collapsed ? "" : "Lương"}</Link>
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
            <Route path="/" element={<Profile />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/salary" element={<Salary />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}