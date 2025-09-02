import express from "express";
import connection from "../connect.js";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// 設定 multer 儲存配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/booking_images/");
  },
  filename: (req, file, cb) => {
    const uniqueName = uuidv4() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制 5MB
  },
});

const router = express.Router();

//-------------------------------------------------------------------------------------

// 取得user的預約諮詢頁列表
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // 取得路由參數

    const sql = `SELECT 
    CONCAT('#', LPAD(b.id, 7, '0')) as booking_id, 
    CASE 
        WHEN b.status IN (1, 4) THEN DATE_FORMAT(b.service_datetime, '%Y/%m/%d')
        ELSE DATE_FORMAT(b.service_datetime, '%Y/%m/%d %H:%i')
    END as service_datetime,
    CONCAT(b.city, b.district, b.address) as full_address,
    DATE_FORMAT(b.created_at, '%Y/%m/%d %H:%i') as created_at,
    b.price,
    b.status,
    o.name as organizer_name
    FROM bookings b
    JOIN organizers o ON b.organizer_id = o.id  
    WHERE b.user_id = ? AND b.is_valid = 1
    ORDER BY b.created_at DESC`;

    const [bookings] = await connection.execute(sql, [userId]);

    res.status(200).json({
      status: "success",
      data: bookings,
      message: "取得使用者的預約資訊列表",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message ?? "獲取失敗，請洽管理人員",
    });
  }
});

// GET /api/user/organizers - 取得使用者的預約資訊詳細頁

// POST /api/user/organizers/add - (新增) 預約諮詢表單
router.post("/add", upload.array("photos", 4), async (req, res) => {
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
        uploaded_images: req.files ? req.files.length : 0,
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
