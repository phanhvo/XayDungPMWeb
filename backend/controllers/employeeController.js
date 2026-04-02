const employeeService = require("../services/employeeService");

exports.getEmployees = async (req, res) => {
    try {
        const filters = {
            search: req.query.search,
            chucvu: req.query.chucvu,
            mapb: req.query.mapb,
            trangthai: req.query.trangthai
        };
        
        const data = await employeeService.getEmployees(filters);
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const data = await employeeService.getEmployeeById(req.params.manv);
        if (!data) return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const data = await employeeService.createEmployee(req.body);
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const data = await employeeService.updateEmployee(req.params.manv, req.body);
        res.json(data);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        await employeeService.deleteEmployee(req.params.manv);
        res.json({ message: "Xoá nhân viên thành công" });
    } catch (err) {
        // Bắt lỗi Foreign Key từ PostgreSQL (Mã lỗi 23503)
        if (err.code === '23503') {
            return res.status(400).json({ 
                error: "Không thể xoá nhân viên này vì đã có dữ liệu liên quan (chấm công, lương, tài khoản,...)." 
            });
        }
        res.status(400).json({ error: err.message });
    }
};