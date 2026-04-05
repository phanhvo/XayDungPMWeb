const salaryRepo = require("../repositories/salaryRepository");

exports.getMySalary = async (manv) => {
  return await salaryRepo.getSalaryByEmployee(manv);
};
