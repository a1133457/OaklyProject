import express from "express";
import multer from "multer";
import pool from "../connect.js";
import crypto from "crypto";

const upload = multer();

const router = express.Router();

// 查詢使用者單一訂單
router.get("/detail", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const { userId, orderId } = req.query;
    if (!userId || !orderId) {
      const err = new Error("缺少 user_id 或是 order_id");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    const sql = `
        SELECT 
            o.id AS order_id,
            o.order_number,
            o.total_amount,
            o.create_at,
            oi.product_id,
            oi.quantity,
            oi.price,
            oi.size,
            oi.color,
            oi.material
        FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ? AND o.id = ?
        ORDER BY o.create_at DESC, oi.id ASC;
        `;

    const ids = [userId, orderId];
    const [orders] = await connection.execute(sql, ids);
    if (!orders || orders.length === 0) {
      const err = new Error("查詢訂單失敗");
      err.code = 400;
      err.status = "fail";
      throw err;
    }
    res.status(200).json({
      status: "success",
      data: orders,
      message: "訂單查詢成功",
    });
  } catch (error) {
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "訂單查詢錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  } finally {
    connection.release(); // 必須加這行！
  }
});

// 查詢使用者全部訂單
router.get("/", async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const userId = req.query.userId;
    if (!userId) {
      const err = new Error("缺少 user_id");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    const sql = `
        SELECT 
            o.id AS order_id,
            o.order_number,
            o.total_amount,
            o.create_at,
            oi.product_id,
            oi.quantity,
            oi.price,
            oi.size,
            oi.color,
            oi.material
        FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE o.user_id = ?
        ORDER BY o.create_at DESC, oi.id ASC;
        `;

    const [orders] = await connection.execute(sql, [userId]);
    if (!orders || orders.length === 0) {
      const err = new Error("查詢訂單失敗");
      err.code = 400;
      err.status = "fail";
      throw err;
    }
    res.status(200).json({
      status: "success",
      data: orders,
      message: "訂單查詢成功",
    });
  } catch (error) {
    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "訂單查詢錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  } finally {
    connection.release(); // 必須加這行！
  }
});



export default router;
