const departmentRepository = require("../repositories/departmentRepository");

exports.getAllDepartments = async () => {
    return await departmentRepository.getAllDepartments();
};

exports.getDepartmentById = async (mapb) => {
    return await departmentRepository.getDepartmentById(mapb);
};

exports.createDepartment = async (data) => {
    if (!data.mapb || !data.tenpban) {
        throw new Error("Mã và tên phòng ban là bắt buộc");
    }
    return await departmentRepository.createDepartment(data);
};

exports.updateDepartment = async (mapb, data) => {
    return await departmentRepository.updateDepartment(mapb, data);
};

exports.deleteDepartment = async (mapb) => {
    return await departmentRepository.deleteDepartment(mapb);
};

exports.assignEmployeesToDepartment = async (mapb, manvList) => {
    if (!Array.isArray(manvList) || manvList.length === 0) {
        throw new Error("Danh sách mã nhân viên không hợp lệ");
    }
    const dept = await departmentRepository.getDepartmentById(mapb);
    if (!dept) throw new Error("Phòng ban không tồn tại");

    return await departmentRepository.assignEmployeesToDepartment(mapb, manvList);
};