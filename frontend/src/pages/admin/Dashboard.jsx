import { useEffect, useState } from "react";
import API from "../../services/api"; 
import { LuUsers, LuBuilding2, LuWallet, LuCalendarCheck } from "react-icons/lu";
import "../../styles/dashboard.css";

export default function Dashboard() {

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Tạo một bộ đếm chạy mỗi giây
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Xóa bộ đếm khi đóng trang để tránh rò rỉ bộ nhớ
    return () => clearInterval(timer);
  }, []);

  // Hàm định dạng ngày giờ tiếng Việt
  const formatDateTime = (date) => {
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    return date.toLocaleDateString('vi-VN', options);
  };

  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    attendanceToday: 0
  });
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Thêm timestamp để tránh cache, đảm bảo số liệu luôn mới nhất
        const res = await API.get(`admin/dashboard-summary?t=${new Date().getTime()}`);
        
        setStats({
          totalEmployees: res.data.totalEmployees || 0,
          totalDepartments: res.data.totalDepartments || 0,
          totalSalary: res.data.totalSalary || 0,
          attendanceToday: res.data.attendanceToday || 0
        });

        setRecentEmployees(res.data.recentEmployees || []);
      } catch (err) {
        console.error("Lỗi fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Đang tải dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <div className="dashboard-header"> <h2 className="page-title">Báo cáo quản trị nhân sự</h2>
    
    <div className="current-time-display"> {formatDateTime(currentTime)}
    </div>
    </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon"><LuUsers size={24} /></div>
          <div className="stat-info">
            <p>Tổng nhân viên</p>
            <h3>{stats.totalEmployees.toLocaleString()}</h3>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon"><LuBuilding2 size={24} /></div>
          <div className="stat-info">
            <p>Phòng ban</p>
            <h3>{stats.totalDepartments}</h3>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon"><LuCalendarCheck size={24} /></div>
          <div className="stat-info">
            <p>Đi làm hôm nay</p>
            <h3>{stats.attendanceToday}</h3>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon"><LuWallet size={24} /></div>
          <div className="stat-info">
            <p>Quỹ lương cơ bản</p>
            <h3>
              {new Intl.NumberFormat('vi-VN', { 
                style: 'currency', 
                currency: 'VND' 
              }).format(stats.totalSalary)}
            </h3>
          </div>
        </div>
      </div>

      <div className="table-section">
        <div className="table-header">
          <h3>Nhân viên mới gia nhập</h3>
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Ngày bắt đầu</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {recentEmployees.length > 0 ? (
              recentEmployees.map((nv) => (
                <tr key={nv.manv}>
                  <td>{nv.manv}</td>
                  <td><strong>{nv.hotennv}</strong></td>
                  <td>{nv.chucvu}</td>
                  <td>{new Date(nv.ngaybatdaulam).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <span className={`status-badge ${nv.trangthai === 'đang làm' ? 'active' : 'inactive'}`}>
                      {nv.trangthai}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="empty-row">Chưa có dữ liệu nhân viên mới.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
