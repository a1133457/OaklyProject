import express from "express";
import connection from "../connect.js";
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 設定 multer 儲存配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/booking_images/');
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制 5MB
  }
});

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
router.post("/form", upload.array('photos', 4), async (req, res) => {
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

    const [bookingResult] = await connection.execute(sql, [
      user_id,
      city,
      district,
      address,
      organizer_id,
      service_datetime,
      note,
    ]);

    const bookingId = bookingResult.insertId;

    // 處理圖片
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const imageUrl = `/uploads/booking_images/${file.filename}`;
        const imageSql = `INSERT INTO booking_images (booking_id, image_url) VALUES (?, ?)`;
        await connection.execute(imageSql, [bookingId, imageUrl]);
      }
    }

    res.status(201).json({
      status: "success",
      data: {
        booking_id: bookingId,
        uploaded_images: req.files ? req.files.length : 0
      },
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
