const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("API QuanLyNhanSu đang hoạt động!");
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running...");
});
