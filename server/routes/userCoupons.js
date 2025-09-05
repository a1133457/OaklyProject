import express from "express";
import connection from "../connect.js";

const router = express.Router();

// GET /api/user-coupons/:userId - 取得個人優惠券
router.get("/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const sql = `
      SELECT 
        uc.id AS user_coupon_id,
        uc.user_id,
        uc.get_at,
        uc.used_at,
        uc.expire_at,
        uc.status,
        c.id AS coupon_id,
        c.name AS coupon_name,
        c.discount_type,
        c.discount_value,
        c.valid_days,
        c.is_valid
      FROM user_coupons uc
      JOIN coupons c ON uc.coupon_id = c.id
      WHERE uc.user_id = ?
      ORDER BY uc.get_at DESC
    `;

        const [rows] = await connection.execute(sql, [userId]);

        res.status(200).json({
            status: "success",
            data: rows,
            message: "已獲取個人優惠券"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message ?? "獲取失敗，請洽管理人員"
        });
    }
});

// POST /api/user-coupons - 領取優惠券
router.post("/add", async (req, res) => {
    try {
        const { user_id, coupon_id } = req.body;

        if (!user_id || !coupon_id) {
            return res.status(400).json({
                status: "error",
                message: "缺少必要參數 user_id 或 coupon_id"
            });
        }

        // 先查詢優惠券資訊
        const [couponRows] = await connection.execute(
            "SELECT * FROM coupons WHERE id = ? AND is_valid = 1",
            [coupon_id]
        );

        if (couponRows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "優惠券不存在或無效"
            });
        }

        const coupon = couponRows[0];

        // 計算領取時間與到期時間
        const now = new Date();
        const expireAt = coupon.valid_days
            ? new Date(now.getTime() + coupon.valid_days * 24 * 60 * 60 * 1000)
            : null;

        // 確認使用者是否已領過同一張券 (避免重複領取)
        const [existRows] = await connection.execute(
            "SELECT id FROM user_coupons WHERE user_id = ? AND coupon_id = ?",
            [user_id, coupon_id]
        );

        if (existRows.length > 0) {
            return res.status(400).json({
                status: "error",
                message: "您已經領取過這張優惠券"
            });
        }

        // 插入 user_coupons
        await connection.execute(
            "INSERT INTO user_coupons (user_id, coupon_id, get_at, expire_at, status) VALUES (?, ?, ?, ?, 0)",
            [user_id, coupon_id, now, expireAt]
        );

        res.status(201).json({
            status: "success",
            message: "優惠券領取成功",
            data: {
                user_id,
                coupon_id,
                get_at: now,
                expire_at: expireAt
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message ?? "領取失敗，請洽管理人員"
        });
    }
});

// POST /api/user-coupons/use - 使用優惠券
router.post("/use", async (req, res) => {
    try {
        const { user_id, coupon_id } = req.body;

        if (!user_id || !coupon_id) {
            return res.status(400).json({
                status: "error",
                message: "缺少必要參數 user_id 或 coupon_id"
            });
        }

        // 查詢該使用者是否擁有這張券
        const [rows] = await connection.execute(
            `SELECT uc.id AS user_coupon_id, uc.status, uc.expire_at, 
              c.id AS coupon_id, c.name, c.discount_type, c.discount_value, c.is_valid
       FROM user_coupons uc
       JOIN coupons c ON uc.coupon_id = c.id
       WHERE uc.user_id = ? AND uc.coupon_id = ?`,
            [user_id, coupon_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "找不到您的優惠券"
            });
        }

        const uc = rows[0];
        const now = new Date();

        // 驗證條件
        if (!uc.is_valid) {
            return res.status(400).json({ status: "error", message: "優惠券已失效" });
        }

        if (uc.status !== 0) {
            return res.status(400).json({ status: "error", message: "優惠券已使用或無法使用" });
        }

        if (uc.expire_at && new Date(uc.expire_at) < now) {
            return res.status(400).json({ status: "error", message: "優惠券已過期" });
        }

        // 更新為已使用
        await connection.execute(
            "UPDATE user_coupons SET status = 1, used_at = ? WHERE id = ?",
            [now, uc.user_coupon_id]
        );

        res.status(200).json({
            status: "success",
            message: "優惠券使用成功",
            data: {
                coupon_id: uc.coupon_id,
                coupon_name: uc.name,
                discount_type: uc.discount_type,
                discount_value: uc.discount_value,
                used_at: now
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: error.message ?? "優惠券套用失敗，請洽管理人員"
        });
    }
});

export default router;

// 這是欣錞假定的個人優惠券