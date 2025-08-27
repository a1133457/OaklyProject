import express from "express";
import connection from "../connect.js";

const router = express.Router();

// GET /api/organizers - 取得所有整理師
router.get("/", async (req, res) => {
  try {
    const [organizers] = await connection.execute("SELECT * FROM organizers");
    res.status(200).json({
      status: "success",
      data: organizers,
      message: "已獲取所有整理師"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error", 
      message: error.message ?? "獲取失敗，請洽管理人員"
    });
  }
});

// POST /api/organizers/form - (新增) 處理表單提交
router.post("/form", async (req, res) => {
  try {
    const {
      user_id,
      city,
      district,
      address,
      organizer_id,
      service_datetime,
      note,
    } = req.body;

    const sql = `INSERT INTO bookings 
                 (user_id, city, district, address, organizer_id, service_datetime, note) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const [result] = await connection.execute(sql, [
      user_id,
      city,
      district,
      address,
      organizer_id,
      service_datetime,
      note,
    ]);

    res.status(201).json({
      status: "success",
    //   data: { booking_id: result.insertId },
      message: "提交諮詢表單成功",
    });
  } catch (error) {
    console.log(error);
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "提交失敗，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  }
});

export default router;
