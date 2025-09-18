import express from "express";
import multer from "multer";
import pool from "../connect.js";
import crypto from "crypto";

const upload = multer();

const router = express.Router();

// 查詢使用者單一訂單
// 查詢使用者單一訂單 - 修改版本
router.get("/detail", async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const { userId, orderId } = req.query;
    if (!userId || !orderId) {
      const err = new Error("缺少 userId 或 orderId");
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
        o.buyer_name,
        o.buyer_email,
        o.buyer_phone,
        o.recipient_name,
        o.recipient_phone,
        o.postal_code,
        o.address,
        oi.product_id,
        oi.quantity,
        oi.price,
        oi.size,
        oi.color,
        oi.material,
        p.name AS product_name,
        pi.url AS product_image,
        c.name AS coupon_name,
        c.discount_type,
        c.discount AS coupon_discount_value
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN (
          SELECT product_id, MIN(img) AS url
          FROM product_img
          GROUP BY product_id
      ) pi ON p.id = pi.product_id
      LEFT JOIN user_coupons uc ON o.user_id = uc.user_id 
        AND uc.used_at IS NOT NULL 
        AND DATE(uc.used_at) = DATE(o.create_at)
      LEFT JOIN coupons c ON uc.coupon_id = c.id
      WHERE o.user_id = ? AND o.id = ?
      ORDER BY oi.id ASC;
    `;

    const [orders] = await connection.execute(sql, [userId, orderId]);

    if (!orders.length) {
      return res.status(404).json({
        status: "fail",
        message: "查無訂單",
      });
    }
    let couponDiscount = 0;
    if (orders[0].coupon_discount_value && orders[0].discount_type) {
      const subtotal = orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      if (orders[0].discount_type === 1) { // 假設1是百分比折扣
        couponDiscount = Math.floor(subtotal * (orders[0].coupon_discount_value / 100));
      } else if (orders[0].discount_type === 2) { // 假設2是固定金額折扣
        couponDiscount = orders[0].coupon_discount_value;
      }
    }
    // 組合完整的訂單資料
    const orderData = {
      order_id: orders[0].order_id,
      order_number: orders[0].order_number,
      total_amount: orders[0].total_amount,
      create_at: orders[0].create_at,
      buyer_name: orders[0].buyer_name,
      buyer_email: orders[0].buyer_email,
      buyer_phone: orders[0].buyer_phone,
      recipient_name: orders[0].recipient_name,
      recipient_phone: orders[0].recipient_phone,
      postal_code: orders[0].postal_code,
      address: orders[0].address,
        coupon_discount: couponDiscount,
  shipping_discount: 0, // 如果有運費折扣邏輯可以加入
  coupon_name: orders[0].coupon_name || null,
      items: orders.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
        material: item.material,
      }))
    };

    await connection.commit();

    res.status(200).json({
      status: "success",
      data: orderData,
      message: "訂單查詢成功",
    });
  } catch (error) {
    if (connection) await connection.rollback();

    const statusCode = error.code ?? 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "訂單查詢錯誤，請洽管理人員";

    res.status(statusCode).json({
      status: statusText,
      message,
    });
  } finally {
    if (connection) connection.release();
  }
});







// 查詢使用者全部訂單
router.get("/", async (req, res) => {
  let connection;
  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

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
    oi.material,
    p.name AS product_name,
    pi.url AS product_image
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN (
    SELECT product_id, MIN(img) AS url
    FROM product_img
    GROUP BY product_id
) pi ON p.id = pi.product_id
WHERE o.user_id = ?
ORDER BY o.create_at DESC, oi.id ASC;


        `;

    const [orders] = await connection.execute(sql, [userId]);
    if (!orders) {
      const err = new Error("查詢訂單失敗");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    res.status(200).json({
      status: "success",
      data: orders,
      message: orders.length === 0 ? "目前沒有訂單" : "訂單查詢成功",
    });
  } catch (error) {
    if (connection) await connection.rollback();
    const statusCode = typeof error.code === "number" ? error.code : 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "訂單查詢錯誤，請洽管理人員";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  } finally {
    if (connection) connection.release();
  }
});



export default router;
