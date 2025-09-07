import express from "express";
import pool from "../connect.js";

const router = express.Router();

// GET /api/user/coupons - 取得領取 有效(沒過期未使用) 以及 已使用 兩個狀態
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params; // 取得路由參數
    const sql = `SELECT 
      uc.*,
      c.name,
      c.discount,
      c.min_discount,
      c.start_at,
      c.end_at,
      GROUP_CONCAT(pc.name) as category_names
    FROM user_coupons uc
    JOIN coupons c ON uc.coupon_id = c.id
    LEFT JOIN coupon_categories cc ON c.id = cc.coupon_id
    LEFT JOIN products_category pc ON cc.category_id = pc.id
    WHERE uc.user_id = ? AND uc.status IN (0, 1)
    GROUP BY uc.id
    ORDER BY uc.status ASC`;
    
    const [coupons] = await pool.execute(sql, [userId]);
    res.status(200).json({
      status: "success",
      data: coupons,
      message: "取得使用者的優惠券資料",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message ?? "獲取失敗，請洽管理人員",
    });
  }
});

// POST /api/user/:userId/:couponId - 領取優惠券
router.post("/:userId/:couponId", async (req, res) => {
  try {
    const { userId, couponId } = req.params;
    
    // 1. 檢查優惠券是否存在且有效
    const [couponCheck] = await pool.execute(
      "SELECT * FROM coupons WHERE id = ? AND is_valid = 1",
      [couponId]
    );
    
    if (couponCheck.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "優惠券不存在或已失效"
      });
    }
    
    const coupon = couponCheck[0];
    
    // 2. 檢查用戶是否已經領取過這張券
    const [existingCoupon] = await pool.execute(
      "SELECT * FROM user_coupons WHERE user_id = ? AND coupon_id = ?",
      [userId, couponId]
    );
    
    if (existingCoupon.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "您已經領取過這張優惠券"
      });
    }
    
    // 3. 計算過期時間
    let expireAt;
    if (coupon.valid_days) {
      // 領取後N天有效
      const expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + coupon.valid_days);
      expireDate.setHours(23, 59, 59, 999); // 設定為當天最後一秒
      expireAt = expireDate.toISOString().slice(0, 19).replace('T', ' ');
    } else if (coupon.end_at) {
      // 使用券的固定結束時間
      expireAt = coupon.end_at;
    } else {
      return res.status(400).json({
        status: "error",
        message: "優惠券時間設定錯誤"
      });
    }
    
    // 4. 新增領取記錄
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      "INSERT INTO user_coupons (user_id, coupon_id, get_at, expire_at, status) VALUES (?, ?, ?, ?, 0)",
      [userId, couponId, now, expireAt]
    );
    
    res.status(201).json({
      status: "success",
      message: "優惠券領取成功",
      data: {
        userId: parseInt(userId),
        couponId: parseInt(couponId),
        expireAt: expireAt
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "error",
      message: error.message ?? "領取失敗，請洽管理人員"
    });
  }
});


export default router;