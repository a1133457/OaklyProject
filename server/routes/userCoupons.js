import express from "express";
import connection from "../connect.js";

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
    const [coupons] = await connection.execute(sql, [userId]);
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

// POST /api/user/coupons/add - 領取優惠券


export default router;
