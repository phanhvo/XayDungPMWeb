const attendanceRepo = require("../repositories/attendanceRepository");

exports.getMyAttendance = async (manv) => {
  return await attendanceRepo.getAttendanceByEmployee(manv);
};

exports.checkIn = async (manv) => {
  // Cắt lấy định dạng YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];
  const existing = await attendanceRepo.getTodayAttendance(manv, today);

  if (existing) throw new Error("Hôm nay bạn đã check-in rồi!");

  const now = new Date();
  // Giả sử quy định công ty sau 8h00 là đi trễ
  const isLate = now.getHours() >= 8 && now.getMinutes() > 0;
  const trangthai = isLate ? "đi trễ" : "đi làm";

  // Random ID cho macc (dựa theo giới hạn VARCHAR(10))
  const macc =
    "C" +
    Math.floor(Math.random() * 100000000)
      .toString()
      .padStart(8, "0");

  return await attendanceRepo.checkIn({
    macc,
    ngaylam: today,
    checkin: now,
    trangthai,
    manv: manv,
  });
};

exports.checkOut = async (manv) => {
  const today = new Date().toISOString().split("T")[0];
  const record = await attendanceRepo.getTodayAttendance(manv, today);

  if (!record) throw new Error("Bạn chưa check-in hôm nay!");
  if (record.checkout) throw new Error("Bạn đã check-out hôm nay rồi!");

  const checkinTime = new Date(record.checkin);
  const checkoutTime = new Date();

  // Tính tổng giờ làm (chuyển đổi ms -> giờ)
  const diffMs = checkoutTime - checkinTime;
  const sogiolam = (diffMs / (1000 * 60 * 60)).toFixed(2);

  let trangthai = record.trangthai;
  if (sogiolam > 8) trangthai = "tăng ca";

  return await attendanceRepo.checkOut(record.macc, {
    checkout: checkoutTime,
    sogiolam,
    trangthai,
  });
};
