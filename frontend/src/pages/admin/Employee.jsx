import { useEffect, useState, useRef } from "react";
import API from "../../services/api";
import "../../styles/employee.css";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    manv: "", hotennv: "", gioitinh: "Nam", ngsinh: "", 
    sdt: "", email: "", diachi: "", ngaybatdaulam: "", 
    chucvu: "", trangthai: "Đang làm việc", mapb: ""
  };
  const [form, setForm] = useState(initialForm);
  const [editing, setEditing] = useState(false);

  const [filters, setFilters] = useState({
    search: "", chucvu: "", mapb: "", trangthai: ""
  });

  // 🔥 XỬ LÝ AUTOCOMPLETE PHÒNG BAN
  const [departments, setDepartments] = useState([]);
  const [pbSearchText, setPbSearchText] = useState(""); // Chữ hiển thị trong ô input
  const [showPbDropdown, setShowPbDropdown] = useState(false);
  const autocompleteRef = useRef(null); // Dùng để bắt sự kiện click ra ngoài

  useEffect(() => {
    fetchEmployees();
    fetchDepartments(); // Lấy danh sách phòng ban 1 lần khi load trang
  }, [filters]);

  // Click ra ngoài dropdown thì tự đóng lại
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowPbDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đồng bộ lại text hiển thị phòng ban khi mở form Sửa
  useEffect(() => {
    if (form.mapb && departments.length > 0) {
      const dept = departments.find(d => d.mapb === form.mapb);
      setPbSearchText(dept ? `${dept.tenpban} (${dept.mapb})` : form.mapb);
    } else {
      setPbSearchText("");
    }
  }, [form.mapb, departments, isModalOpen]);

  const fetchDepartments = async () => {
    try {
      const res = await API.get("/phongban");
      setDepartments(res.data);
    } catch (err) {
      console.error("Lỗi fetch phòng ban:", err);
    }
  };
  // 🔥 KẾT THÚC KHAI BÁO AUTOCOMPLETE

  const fetchEmployees = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const res = await API.get(`/nhanvien?${queryParams}`);
      setEmployees(res.data);
    } catch (err) {
      console.error("Lỗi fetch data:", err);
    }
  };

  const handleAdd = async () => {
    try {
      await API.post("/nhanvien", form);
      alert("Thêm nhân viên thành công!");
      closeModal();
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || "Thêm thất bại");
    }
  };

  const handleUpdate = async () => {
    try {
      const { manv, ...updateData } = form; 
      await API.put(`/nhanvien/${form.manv}`, updateData);
      alert("Cập nhật thành công!");
      closeModal();
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (manv) => {
    if (!window.confirm("Bạn có chắc muốn xoá nhân viên này?")) return;
    try {
      await API.delete(`/nhanvien/${manv}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.error || "Xoá thất bại");
    }
  };

  const openAddModal = () => {
    setForm(initialForm);
    setEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (emp) => {
    setForm({
      ...emp,
      ngsinh: emp.ngsinh ? emp.ngsinh.split("T")[0] : "",
      ngaybatdaulam: emp.ngaybatdaulam ? emp.ngaybatdaulam.split("T")[0] : ""
    });
    setEditing(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setEditing(false);
    setShowPbDropdown(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="employee-container">
      <div className="header-actions">
        <h1>Quản lý nhân viên</h1>
        <button className="btn-add-new" onClick={openAddModal}>+ Thêm nhân viên</button>
      </div>

      <div className="filter-section" style={{ marginBottom: "20px" }}>
        <input name="search" placeholder="Tìm tên hoặc mã NV..." value={filters.search} onChange={handleFilterChange} />
        <select name="trangthai" value={filters.trangthai} onChange={handleFilterChange}>
          <option value="">Tất cả trạng thái</option>
          <option value="Đang làm việc">Đang làm việc</option>
          <option value="Nghỉ việc">Nghỉ việc</option>
          <option value="Đình chỉ">Đình chỉ</option>
        </select>
        <input name="chucvu" placeholder="Lọc chức vụ..." value={filters.chucvu} onChange={handleFilterChange} />
        <input name="mapb" placeholder="Lọc mã PB..." value={filters.mapb} onChange={handleFilterChange} />
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Cập nhật nhân viên" : "Thêm nhân viên mới"}</h2>
              <button className="btn-close-modal" onClick={closeModal}>&times;</button>
            </div>

            <div className="employee-form-grid">
              <div className="form-group">
                <label>Mã NV (*)</label>
                <input name="manv" value={form.manv} onChange={handleChange} disabled={editing} placeholder="VD: NV001" />
              </div>
              <div className="form-group">
                <label>Họ Tên (*)</label>
                <input name="hotennv" value={form.hotennv} onChange={handleChange} placeholder="Nguyễn Văn A" />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select name="gioitinh" value={form.gioitinh} onChange={handleChange}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input type="date" name="ngsinh" value={form.ngsinh} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input name="sdt" value={form.sdt} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="diachi" value={form.diachi} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Ngày bắt đầu làm</label>
                <input type="date" name="ngaybatdaulam" value={form.ngaybatdaulam} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Chức vụ</label>
                <input name="chucvu" value={form.chucvu} onChange={handleChange} placeholder="VD: Developer" />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select name="trangthai" value={form.trangthai} onChange={handleChange}>
                  <option value="Đang làm việc">Đang làm việc</option>
                  <option value="Nghỉ việc">Nghỉ việc</option>
                  <option value="Đình chỉ">Đình chỉ</option>
                </select>
              </div>

              {/* 🔥 GIAO DIỆN AUTOCOMPLETE PHÒNG BAN */}
              <div className="form-group autocomplete-wrapper" ref={autocompleteRef}>
                <label>Phòng ban</label>
                <input 
                  placeholder="Gõ tên hoặc mã PB..." 
                  value={pbSearchText}
                  onChange={(e) => {
                    setPbSearchText(e.target.value);
                    setShowPbDropdown(true);
                    // Xóa mã phòng ban cũ nếu user bắt đầu gõ chữ mới
                    if (form.mapb) setForm({ ...form, mapb: "" });
                  }}
                  onFocus={() => setShowPbDropdown(true)}
                />

                {showPbDropdown && (
                  <div className="autocomplete-dropdown">
                    {departments
                      .filter(d => {
                        const searchLower = pbSearchText.toLowerCase();
                        const combinedString = `${d.tenpban} (${d.mapb})`.toLowerCase();
                        
                        return (
                          d.mapb.toLowerCase().includes(searchLower) || 
                          d.tenpban.toLowerCase().includes(searchLower) ||
                          combinedString.includes(searchLower) // Bổ sung dòng này!
                        );
                      })
                      .map(d => (
                        <div 
                          key={d.mapb} 
                          className="autocomplete-item"
                          onClick={() => {
                            setForm({ ...form, mapb: d.mapb }); 
                            setPbSearchText(`${d.tenpban} (${d.mapb})`); 
                            setShowPbDropdown(false); 
                          }}
                        >
                          <strong>{d.mapb}</strong> - {d.tenpban}
                        </div>
                      ))}
                      
                    {/* Báo lỗi rỗng cũng cần update lại điều kiện filter y hệt */}
                    {departments.filter(d => {
                        const searchLower = pbSearchText.toLowerCase();
                        const combinedString = `${d.tenpban} (${d.mapb})`.toLowerCase();
                        return (
                          d.mapb.toLowerCase().includes(searchLower) || 
                          d.tenpban.toLowerCase().includes(searchLower) ||
                          combinedString.includes(searchLower)
                        );
                      }).length === 0 && (
                      <div className="autocomplete-item" style={{ color: "red" }}>
                        Không tìm thấy phòng ban nào!
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* 🔥 KẾT THÚC AUTOCOMPLETE */}

            </div>
            
            <div className="form-actions" style={{ marginTop: "20px" }}>
              <button className="btn-clear" onClick={closeModal}>Hủy</button>
              {editing ? (
                <button className="btn-update" onClick={handleUpdate}>Cập nhật</button>
              ) : (
                <button className="btn-add" onClick={handleAdd}>Thêm nhân viên</button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="employee-table">
          <thead>
            <tr>
              <th>Mã NV</th>
              <th>Họ Tên</th>
              <th>Giới tính</th>
              <th>SĐT</th>
              <th>Email</th>
              <th>Chức vụ</th>
              <th>Phòng Ban</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.manv}>
                  <td>{emp.manv}</td>
                  <td>{emp.hotennv}</td>
                  <td>{emp.gioitinh}</td>
                  <td>{emp.sdt}</td>
                  <td>{emp.email}</td>
                  <td>{emp.chucvu}</td>
                  <td>{emp.mapb}</td>
                  <td>
                    <span style={{
                      color: emp.trangthai === 'Nghỉ việc' ? 'red' : 'green',
                      fontWeight: 'bold'
                    }}>
                      {emp.trangthai}
                    </span>
                  </td>
                  <td className="action-btns">
                    <button className="btn-edit" onClick={() => handleEdit(emp)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDelete(emp.manv)}>Xoá</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ textAlign: "center" }}>Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}