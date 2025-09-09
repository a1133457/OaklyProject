import express from "express";
import multer from "multer";
import pool from "../connect.js";
import crypto from "crypto";

const upload = multer();

const router = express.Router();

// #region ecpay-----------------------------
// ECPay 測試用參數
const MerchantID = "2000132";
const HashKey = "5294y06JbISpM5x9";
const HashIV = "v77hoKGq4kWxNNIS";
const ReturnURL = "http://localhost:3005/api/order/ecpay/return"; //ECPay 付款通知後端
const ClientBackURL = "http://localhost:3000/order/fin";  //完成付款後，把使用者倒回前端網址

// 生成 CheckMacValue
function genCheckMacValue(params) {
  const query = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const raw = `HashKey=${HashKey}&${query}&$HashIv=${HashIV}`;

  const encode = encodeURIComponent(raw)
    .toLowerCase()
    .replace(/%20/g, "+")
    .replace(/%2d/g, "-")
    .replace(/%5f/g, "_")
    .replace(/%2e/g, ".")
    .replace(/%21/g, "!")
    .replace(/%2a/g, "*")
    .replace(/%28/g, "(")
    .replace(/%29/g, ")");

  return crypto.createHash("md5").update(encoded).digest("hex").toUpperCase();
}

// 1. 新增 order
router.post("/add", async (req, res) => {
  const connection = await pool.getConnection();
  try {
    // 開始 transaction
    await connection.beginTransaction();
    const {
      user_id,
      total_amount,
      buyer_name,
      buyer_email,
      buyer_phone,
      recipient_name,
      recipient_phone,
      recipient_postal_code,
      recipient_city,
      recipient_address,
      items,
    } = req.body;
    if (
      !user_id ||
      !total_amount ||
      !buyer_name ||
      !buyer_email ||
      !buyer_phone ||
      !recipient_name ||
      !recipient_phone ||
      !recipient_postal_code ||
      !recipient_city ||
      !recipient_address
    ) {
      const err = new Error("缺少必要資料");
      err.code = 400;
      err.status = "fail";
      throw err;
    }

    // 訂單亂碼
    function randomOrderNumber(length = 10) {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0"); // 月份從0開始
      const day = String(now.getDate()).padStart(2, "0");
      const dateStr = `${year}${month}${day}`;

      const chars = "01234567890";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `${dateStr}${result}`;
    }

    const orderNumber = randomOrderNumber();

    // 新增訂單
    const sqlCheck = `INSERT INTO orders
            (order_number, user_id, total_amount, buyer_name, buyer_email, buyer_phone, recipient_name, recipient_phone, postal_code, address)
            VALUES(?,?,?,?,?,?,?,?,?,?)`;
    const [orderResult] = await connection.execute(sqlCheck, [
      orderNumber,
      user_id,
      total_amount,
      buyer_name,
      buyer_email,
      buyer_phone,
      recipient_name,
      recipient_phone,
      postal_code,
      address,
    ]);

    const orderId = orderResult.insertId;

    // 新增訂單商品
    for (const item of items) {
      const sqlCheckItem = `
            INSERT INTO order_items
            (order_id, product_id, quantity, price, size, color, material)
            VALUES(?,?,?,?,?,?,?)
            `;
      await connection.execute(sqlCheckItem, [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
        item.size || null,
        item.color || null,
        item.material || null,
      ]);
    }

    // 提交 transaction
    await connection.commit();
    res.status(201).json({
      status: "success",
      order_id: orderId,
      message: "訂單建立成功",
    });
    // 2. 準備 ECPay參數
    const tradeDate = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 19);

    const params = {
      MerchantID,
      MerchantTradeNo: `TS${orderId}`, // 訂單編號 (唯一)
      MerchantTradeDate: tradeDate,
      PaymentType: "aio",
      TotalAmount: total_amount,
      TradeDesc: "購物車結帳",
      ItemName: items.map((i) => `${i.name}x${i.quantity}`).join("#"),
      ReturnURL,
      ClientBackURL,
      ChoosePayment: "ALL",
    };
    // 3. 生成檢查碼
    params.CheckMacValue = genCheckMacValue(params);

    res.json({
      status: "success",
      orderId,
      ecpayAction: "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5",
      ecpayParams: params,
    });
  } catch (error) {
    await connection.rollback();
    const statusCode = typeof error.code === "number" ? error.code : 500;
    const statusText = error.status ?? "error";
    const message = error.message ?? "建立訂單失敗";
    res.status(statusCode).json({
      status: statusText,
      message,
    });
  } finally {
    connection.release();
  }
});

// #endregion--------------------------------

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



// 付款回傳
router.post("/ecpay/return", (req, res) => {
  console.log("ECPay 回傳資料:", req.body);

  res.send("1|OK"); //一定要回 "1|OK"，ECPay 才會當作通知成功

})

export default router;
