import express from "express";
import connection from "../connect.js";

const router = express.Router();

// GET /api/coupon - 取得所有優惠券內容
router.get("/", async (req, res) => {
  try {
    const [coupons] = await connection.execute("SELECT * FROM coupons");
    res.status(200).json({
      status: "success",
      data: coupons,
      message: "已獲取所有優惠券"
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error", 
      message: error.message ?? "獲取失敗，請洽管理人員"
    });
  }
});

export default router;
