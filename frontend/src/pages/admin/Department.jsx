import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/department.css";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]); // Danh sách toàn bộ nhân viên
  
  // State quản lý Modal Thêm/Sửa phòng ban
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const initialForm = { mapb: "", tenpban: "", mota: "", matp: "" };
  const [form, setForm] = useState(initialForm);

  // State quản lý Modal Gán nhân viên
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [currentDeptAssign, setCurrentDeptAssign] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  // Ý nghĩa: Lấy danh sách phòng ban từ Backend (GET /phongban)
  const fetchDepartments = async () => {
    try {
      const res = await API.get("/phongban");
      setDepartments(res.data);
    } catch (err) {
      console.error("Lỗi fetch phòng ban:", err);
    }
  };

  // Ý nghĩa: Lấy danh sách nhân viên để hiển thị ở mục chọn Trưởng phòng và Modal Gán nhân viên
  const fetchEmployees = async () => {
    try {
      const res = await API.get("/nhanvien");
      setEmployees(res.data);
    } catch (err) {
      console.error("Lỗi fetch nhân viên:", err);
    }
  };

  /* ---------------- XỬ LÝ PHÒNG BAN ---------------- */
  
  const handleAddDept = async () => {
    try {
      await API.post("/phongban", form);
      alert("Thêm phòng ban thành công!");
      closeDeptModal();
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.error || "Thêm thất bại");
    }
  };

  const handleUpdateDept = async () => {
    try {
      const { mapb, ...updateData } = form;
      // Dùng mã phòng ban từ form.mapb để update
      await API.put(`/phongban/${form.mapb}`, updateData);
      alert("Cập nhật phòng ban thành công!");
      closeDeptModal();
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.error || "Cập nhật thất bại");
    }
  };

  const handleDeleteDept = async (mapb) => {
    if (!window.confirm("Bạn có chắc muốn xoá phòng ban này?")) return;
    try {
      await API.delete(`/phongban/${mapb}`);
      fetchDepartments();
    } catch (err) {
      alert(err.response?.data?.error || "Xóa thất bại (Có thể phòng ban đang có nhân viên)");
    }
  };

  const openAddDeptModal = () => {
    setForm(initialForm);
    setEditing(false);
    setIsDeptModalOpen(true);
  };

  const handleEditDept = (dept) => {
    setForm({
      mapb: dept.mapb,
      tenpban: dept.tenpban,
      mota: dept.mota || "",
      matp: dept.matp || ""
    });
    setEditing(true);
    setIsDeptModalOpen(true);
  };

  const closeDeptModal = () => {
    setIsDeptModalOpen(false);
    setForm(initialForm);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ---------------- XỬ LÝ GÁN NHÂN VIÊN ---------------- */

  // Mở modal gán nhân viên cho một phòng ban cụ thể
  const openAssignModal = (dept) => {
    setCurrentDeptAssign(dept);
    // Tự động check các nhân viên đang thuộc phòng ban này
    const currentAssigned = employees
      .filter(emp => emp.mapb === dept.mapb)
      .map(emp => emp.manv);
    setSelectedEmployees(currentAssigned);
    setIsAssignModalOpen(true);
  };

  // Quản lý trạng thái checkbox của danh sách nhân viên
  const handleCheckboxChange = (manv) => {
    setSelectedEmployees(prev => 
      prev.includes(manv) 
        ? prev.filter(id => id !== manv) // Bỏ chọn
        : [...prev, manv]                // Chọn
    );
  };

  // Submit list nhân viên lên API (POST /phongban/:mapb/assign)
  const handleAssignSubmit = async () => {
    try {
      await API.post(`/phongban/${currentDeptAssign.mapb}/assign`, {
        manvList: selectedEmployees
      });
      alert("Gán nhân viên thành công!");
      setIsAssignModalOpen(false);
      fetchEmployees(); // Cập nhật lại dữ liệu nhân viên để biết ai vừa được đổi phòng
    } catch (err) {
      alert(err.response?.data?.error || "Gán nhân viên thất bại");
    }
  };

  return (
    <div className="department-container">
      <div className="header-actions">
        <h1>Quản lý phòng ban</h1>
        <button className="btn-add-new" onClick={openAddDeptModal}>+ Thêm phòng ban</button>
      </div>

      {/* Bảng Danh sách Phòng Ban */}
      <div className="table-responsive">
        <table className="department-table">
          <thead>
            <tr>
              <th>Mã PB</th>
              <th>Tên phòng ban</th>
              <th>Mô tả</th>
              <th>Mã Trưởng Phòng</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {departments.length > 0 ? (
              departments.map((dept) => (
                <tr key={dept.mapb}>
                  <td>{dept.mapb}</td>
                  <td>{dept.tenpban}</td>
                  <td>{dept.mota}</td>
                  <td>{dept.matp || "Chưa có"}</td>
                  <td className="action-btns">
                    <button className="btn-assign" onClick={() => openAssignModal(dept)}>Gán NV</button>
                    <button className="btn-edit" onClick={() => handleEditDept(dept)}>Sửa</button>
                    <button className="btn-delete" onClick={() => handleDeleteDept(dept.mapb)}>Xoá</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" style={{ textAlign: "center" }}>Chưa có dữ liệu phòng ban</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Thêm/Sửa Phòng Ban */}
      {isDeptModalOpen && (
        <div className="modal-overlay" onClick={closeDeptModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? "Sửa phòng ban" : "Thêm phòng ban mới"}</h2>
              <button className="btn-close-modal" onClick={closeDeptModal}>&times;</button>
            </div>
            
            <div className="form-group">
              <label>Mã PB (*)</label>
              <input name="mapb" value={form.mapb} onChange={handleFormChange} disabled={editing} placeholder="VD: PB01" />
            </div>
            <div className="form-group">
              <label>Tên phòng ban (*)</label>
              <input name="tenpban" value={form.tenpban} onChange={handleFormChange} placeholder="VD: Phòng IT" />
            </div>
            <div className="form-group">
              <label>Mô tả</label>
              <textarea name="mota" rows="3" value={form.mota} onChange={handleFormChange} placeholder="Mô tả công việc phòng ban..." />
            </div>
            <div className="form-group">
              <label>Trưởng phòng</label>
              <select name="matp" value={form.matp} onChange={handleFormChange}>
                <option value="">-- Chọn trưởng phòng --</option>
                {employees.map(emp => (
                  <option key={emp.manv} value={emp.manv}>{emp.hotennv} ({emp.manv})</option>
                ))}
              </select>
            </div>

            <div className="form-actions">
              <button className="btn-clear" onClick={closeDeptModal}>Hủy</button>
              <button className="btn-save" onClick={editing ? handleUpdateDept : handleAddDept}>
                {editing ? "Lưu thay đổi" : "Tạo phòng ban"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gán Nhân Viên vào Phòng Ban */}
      {isAssignModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAssignModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Gán nhân viên - {currentDeptAssign?.tenpban}</h2>
              <button className="btn-close-modal" onClick={() => setIsAssignModalOpen(false)}>&times;</button>
            </div>

            <p style={{marginBottom: "10px", fontSize: "14px"}}>Chọn nhân viên bạn muốn điều chuyển vào phòng ban này:</p>
            
            <div className="employee-list">
              {employees.length > 0 ? employees.map(emp => (
                <label key={emp.manv} className="employee-item">
                  <input 
                    type="checkbox" 
                    checked={selectedEmployees.includes(emp.manv)}
                    onChange={() => handleCheckboxChange(emp.manv)}
                  />
                  <span>
                    <strong>{emp.hotennv}</strong> ({emp.manv}) 
                    {emp.mapb && emp.mapb !== currentDeptAssign.mapb && ` - Đang ở: ${emp.mapb}`}
                  </span>
                </label>
              )) : (
                <p>Không có dữ liệu nhân viên</p>
              )}
            </div>

            <div className="form-actions">
              <button className="btn-clear" onClick={() => setIsAssignModalOpen(false)}>Hủy</button>
              <button className="btn-save" onClick={handleAssignSubmit}>Lưu danh sách</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}