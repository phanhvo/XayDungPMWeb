import { useEffect, useState } from "react";
import API from "../../services/api";
import "../../styles/account.css";

export default function Accounts() {
    const [accounts, setAccounts] = useState([]);
    const [form, setForm] = useState({
        tentk: "",
        password: "",
        phanquyen: "nhanvien",
        manv: ""
    });

    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchAccounts();
    }, []);

    // 🔥 GET
    const fetchAccounts = async () => {
        try {
            const res = await API.get("/taikhoan");
            console.log("DATA:", res.data); // 🔥 THÊM DÒNG NÀY
            setAccounts(res.data);
        } catch (err) {
            console.error("ERROR:", err);
        }
    };

    // 🔥 ADD
    const handleAdd = async () => {
        try {
            await API.post("/taikhoan", form);
            fetchAccounts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Thêm thất bại");
        }
    };
    // 🔥 DELETE
    const handleDelete = async (tentk) => {
        const isConfirm = window.confirm("Bạn có chắc muốn xoá tài khoản này?");

        if (!isConfirm) return;

        try {
            await API.delete(`/taikhoan/${tentk}`);
            fetchAccounts();
        } catch (err) {
            console.error(err);
            alert("Xoá thất bại");
        }
    };

    // 🔥 EDIT
    const handleEdit = (acc) => {
        setForm({
            tentk: acc.tentk,
            password: "",
            phanquyen: acc.phanquyen,
            manv: acc.manv
        });
        setEditing(true);
    };

    // 🔥 UPDATE
    const handleUpdate = async () => {
        try {
            await API.put(`/taikhoan/${form.tentk}`, {
                phanquyen: form.phanquyen,
                trangthai: "hoạt động"
            });

            setEditing(false);
            fetchAccounts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.error || "Update thất bại");
        }
    };
    const handleClear = () => {
        setForm({
            tentk: "",
            password: "",
            phanquyen: "nhanvien",
            manv: ""
        });
        setEditing(false);
    };

    return (
        <div className="account-container">
            <h1>Quản lý tài khoản</h1>

            <div className="account-form">
                {/* FORM */}
                <input
                    placeholder="Tài khoản"
                    value={form.tentk}
                    onChange={(e) => setForm({ ...form, tentk: e.target.value })}
                />

                {!editing && (
                    <input
                        placeholder="Mật khẩu"
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                )}

                <select
                    value={form.phanquyen}
                    onChange={(e) => setForm({ ...form, phanquyen: e.target.value })}
                >
                    <option value="admin">Admin</option>
                    <option value="nhanvien">Nhân viên</option>
                </select>

                <input
                    placeholder="Mã NV"
                    value={form.manv}
                    onChange={(e) => setForm({ ...form, manv: e.target.value })}
                />

                {editing ? (
                    <button onClick={handleUpdate}>Cập nhật</button>
                ) : (
                    <>
                        <button onClick={handleAdd}>Thêm</button>
                        <button onClick={handleClear} className="btn-clear">Clear</button>
                    </>
                )}
            </div>

            {/* TABLE */}
            <table className="account-table">
                <thead>
                    <tr>
                        <th>Tài khoản</th>
                        <th>Quyền</th>
                        <th>Trạng thái</th>
                        <th>Mã NV</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {accounts.map((acc) => (
                        <tr key={acc.tentk}>
                            <td>{acc.tentk}</td>
                            <td>{acc.phanquyen}</td>
                            <td>{acc.trangthai}</td>
                            <td>{acc.manv}</td>
                            <td>
                                <button onClick={() => handleEdit(acc)}>Sửa</button>
                                <button onClick={() => handleDelete(acc.tentk)}>Xoá</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}