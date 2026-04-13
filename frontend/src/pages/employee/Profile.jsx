import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/emp.css";


export default function Profile() {
  const [profile, setProfile] = useState(null);
  const manv = localStorage.getItem("manv");
  console.log("manv in Profile.jsx", manv);


  const fetchMyProfile = async () => {
    try {
      const res = await API.get(`/nhanvien/${manv}`);
      setProfile(res.data);
    } catch (err) {
      console.error("Lỗi lấy thông tin:", err);
    }
  };

  useEffect(() => {
    // Nếu có mã nhân viên trong LocalStorage thì mới gọi API
    if (manv) {
      fetchMyProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manv]);

  if (!profile)
    return (
      <div style={{ padding: "20px" }}>
        Đang tải dữ liệu... (Nếu màn hình này đứng im, vui lòng ấn Đăng Xuất và
        Đăng Nhập lại)
      </div>
    );

  // Lấy đúng tên cột từ Database (PostgreSQL trả về ma_nhan_vien, ma_phong_ban)
  const employeeId = profile.manv;
  const deptId = profile.mapb;

  return (
    <div className="portal-container">
      <h2>Hồ Sơ Cá Nhân</h2>
      <div className="profile-card">
        <div className="profile-header">
          <div className="avatar">
            {profile.hotennv ? profile.hotennv.charAt(0) : "U"}
          </div>
          <div>
            <h3>{profile.hotennv}</h3>
            <p className="badge">{profile.chucvu}</p>
          </div>
        </div>

        <div className="profile-body">
          <div className="info-group">
            <label>Mã Nhân Viên:</label>
            <span>{employeeId}</span>
          </div>
          <div className="info-group">
            <label>Phòng Ban:</label>
            <span>{deptId}</span>
          </div>
          <div className="info-group">
            <label>Giới tính:</label>
            <span>{profile.gioitinh}</span>
          </div>
          <div className="info-group">
            <label>Ngày sinh:</label>
            <span>{profile.ngsinh ? profile.ngsinh.split("T")[0] : "---"}</span>
          </div>
          <div className="info-group">
            <label>Số điện thoại:</label>
            <span>{profile.sdt}</span>
          </div>
          <div className="info-group">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>
          <div className="info-group">
            <label>Địa chỉ:</label>
            <span>{profile.diachi}</span>
          </div>
          <div className="info-group">
            <label>Ngày vào làm:</label>
            <span>
              {profile.ngaybatdaulam
                ? profile.ngaybatdaulam.split("T")[0]
                : "---"}
            </span>
          </div>
          <div className="info-group">
            <label>Trạng thái:</label>
            <span
              style={{
                color: profile.trangthai === "đang làm" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {profile.trangthai}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
