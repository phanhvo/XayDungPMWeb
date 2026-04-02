const employeeRepository = require("../repositories/employeeRepository");

exports.getEmployees = async (filters) => {
    return await employeeRepository.getEmployees(filters);
};

exports.getEmployeeById = async (manv) => {
    return await employeeRepository.getEmployeeById(manv);
};

exports.createEmployee = async (data) => {
    if (!data.manv || !data.hotennv) {
        throw new Error("Mã nhân viên và Họ tên nhân viên là bắt buộc");
    }
    return await employeeRepository.createEmployee(data);
};

exports.updateEmployee = async (manv, data) => {
    return await employeeRepository.updateEmployee(manv, data);
};

exports.deleteEmployee = async (manv) => {
    return await employeeRepository.deleteEmployee(manv);
};