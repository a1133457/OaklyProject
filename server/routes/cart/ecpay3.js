import express from "express";
import crypto from "crypto";
import ecpay_payment from "ecpay_aio_nodejs";
import dotenv from "dotenv";
dotenv.config();
import pool from '../../connect.js';

const router = express.Router();

// 綠界提供的 SDK
const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env;

// SDK 提供的範例，初始化
const options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: MERCHANTID || "2000132",
    HashKey: HASHKEY || "5294y06JbISpM5x9",
    HashIV: HASHIV || "v77hoKGq4kWxNNIS",
  },
  IgnorePayment: [],
  IsProjectContractor: false,
};

router.post("/ecpay/create", async (req, res) => {
  let connection;

  try {
    connection = await pool.getConnection();
    console.log("=== 收到 ecpay 請求 ===");
    console.log("完整 req.body:", JSON.stringify(req.body, null, 2));

    const {
      totalAmount,
      userId,
      buyerName,
      buyerEmail,
      buyerPhone,
      recipientName,
      recipientPhone,
      postcode,
      address,
    } = req.body;

    // 特別處理 cartItems
    let cartItems;
    const cartItemsRaw = req.body.cartItems || req.body.cart_items || req.body.items;

    console.log("cartItems 原始資料:");
    console.log("cartItemsRaw:", cartItemsRaw);
    console.log("cartItemsRaw 型別:", typeof cartItemsRaw);

    // 先解析 cartItemsRaw 成 cartItems
    if (typeof cartItemsRaw === 'string') {
      try {
        cartItems = JSON.parse(cartItemsRaw);
        console.log("從字串解析的 cartItems:", cartItems);
      } catch (error) {
        console.error("cartItems JSON 解析失敗:", error);
        return res.status(400).json({
          status: "fail",
          message: "購物車資料格式錯誤: " + error.message
        });
      }
    } else if (Array.isArray(cartItemsRaw)) {
      cartItems = cartItemsRaw;
      console.log("直接使用陣列 cartItems:", cartItems);
    } else {
      console.error("cartItems 格式不正確:", cartItemsRaw);
      return res.status(400).json({
        status: "fail",
        message: "購物車資料格式不正確，收到的資料類型: " + typeof cartItemsRaw
      });
    }

    // 現在才檢查已解析的 cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: '購物車資料為空或格式錯誤'
      });
    }

    console.log("最終 cartItems:", cartItems);
    console.log("cartItems 是陣列:", Array.isArray(cartItems));
    console.log("cartItems 長度:", cartItems?.length);

    if (!totalAmount || !userId || !recipientName || !recipientPhone || !address) {
      return res.status(400).json({
        status: "fail",
        message: '缺少必要資訊：totalAmount, userId, recipientName, recipientPhone, address'
      });
    }

    // === 1. 驗證商品資料與計算金額 ===
    let calculatedAmount = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      console.log("處理商品:", item);

      // 從資料庫取得商品最新資訊（價格、庫存等）
      const [products] = await connection.execute(`
        SELECT id, name, price FROM products WHERE id = ?
      `, [item.product_id || item.id]);

      if (!products || products.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: `找不到商品 ID: ${item.product_id || item.id}`
        });
      }

      const product = products[0];
      console.log("找到商品:", product);

      // 檢查庫存（如果有庫存欄位）
      // if (product.stock !== undefined && product.stock < item.quantity) {
      //   return res.status(400).json({
      //     status: "fail",
      //     message: `商品 ${product.name} 庫存不足，目前庫存: ${product.stock}`
      //   });
      // }

      // 使用資料庫的最新價格計算
      const itemTotal = product.price * item.quantity;
      calculatedAmount += itemTotal;

      // 儲存驗證後的商品資料
      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        quantity: item.quantity,
        price: product.price, // 使用資料庫的價格
        size: item.size || null,
        color: item.color || null,
        material: item.material || null
      });
    }

    console.log("計算總金額:", calculatedAmount);
    console.log("傳入總金額:", totalAmount);

    // 驗證總金額
    if (Math.abs(calculatedAmount - parseInt(totalAmount)) > 1) {
      return res.status(400).json({
        status: "fail",
        message: `金額驗證失敗，計算金額: ${calculatedAmount}, 傳入金額: ${totalAmount}`
      });
    }

    // === 2. 生成訂單編號 ===
    const TradeNo = "ORD" + Date.now() + userId;

    // === 3. 準備綠界付款參數 ===
    const now = new Date();
    const MerchantTradeDate =
      now.getFullYear() + '/' +
      String(now.getMonth() + 1).padStart(2, '0') + '/' +
      String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' +
      String(now.getMinutes()).padStart(2, '0') + ':' +
      String(now.getSeconds()).padStart(2, '0');

    // 處理商品名稱
    let itemName = validatedItems.map(item => item.product_name).join("#");
    if (itemName.length > 400) {
      itemName = itemName.substring(0, 397) + "...";
    }

    let base_param = {
      MerchantID: MERCHANTID || "2000132",
      PaymentType: "aio",
      MerchantTradeNo: TradeNo,
      MerchantTradeDate,
      TotalAmount: calculatedAmount.toString(),
      TradeDesc: "線上購物付款",
      ItemName: itemName,
      ReturnURL: `${HOST}/cart`,
      ClientBackURL: `${HOST}/cart/fin?orderNo=${TradeNo}`,
      ChoosePayment: 'ALL',
      EncryptType: 1
    };

    // === 4. 將訂單資料暫存到 session 或記憶體中 ===
    global.pendingOrders = global.pendingOrders || new Map();
    global.pendingOrders.set(TradeNo, {
      user_id: userId,
      buyer_name: buyerName || '購買者',
      buyer_email: buyerEmail || null,
      buyer_phone: buyerPhone || null,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      postal_code: postcode || '', // 修正：使用 postcode 而不是 postalCode
      address: address,
      total_amount: calculatedAmount,
      cart_items: validatedItems,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 60 * 60 * 1000) // 1小時後過期
    });

    console.log('✅ 訂單資料已暫存, 付款參數:', base_param);

    // === 5. 產生付款頁面並跳轉 ===
    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(base_param);

    res.send(html);

  } catch (error) {
    console.error('❌ 處理付款請求失敗:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  } finally {
    if (connection) connection.release();
  }
});


// 確認訂單付款狀態的 API（供前端 ClientBackURL 使用）
router.post("/ecpay/confirm", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("=== 收到付款確認請求（來自 ClientBackURL）===");

    const { orderNo } = req.body;

    if (!orderNo) {
      return res.status(400).json({
        success: false,
        message: "缺少訂單編號"
      });
    }

    console.log("確認訂單:", orderNo);

    // 從暫存中取得訂單資料
    global.pendingOrders = global.pendingOrders || new Map();
    const orderData = global.pendingOrders.get(orderNo);

    if (!orderData) {
      return res.status(404).json({
        success: false,
        message: "找不到暫存的訂單資料，可能已過期"
      });
    }

    console.log("找到暫存訂單資料:", orderData);

    // 檢查是否過期
    if (new Date() > orderData.expires_at) {
      global.pendingOrders.delete(orderNo);
      return res.status(404).json({
        success: false,
        message: "訂單資料已過期"
      });
    }

    await connection.beginTransaction();

    try {
      // 創建正式訂單記錄
      const [orderResult] = await connection.execute(`
        INSERT INTO orders (
          order_number, 
          user_id, 
          total_amount, 
          buyer_name, 
          buyer_email, 
          buyer_phone, 
          recipient_name, 
          recipient_phone, 
          postal_code, 
          address
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        orderNo,
        orderData.user_id,
        orderData.total_amount,
        orderData.buyer_name,
        orderData.buyer_email,
        orderData.buyer_phone,
        orderData.recipient_name,
        orderData.recipient_phone,
        orderData.postal_code,
        orderData.address
      ]);

      const orderId = orderResult.insertId;
      console.log("✅ 訂單主表創建成功, ID:", orderId);

      // 創建訂單明細
      let itemCount = 0;
      for (const item of orderData.cart_items) {
        await connection.execute(`
          INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity, 
            price, 
            size, 
            color, 
            material
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.size,
          item.color,
          item.material
        ]);
        itemCount++;
      }

      console.log(`✅ 訂單明細創建成功: ${itemCount} 項商品`);


      // 清理暫存資料
      global.pendingOrders.delete(orderNo);
      console.log("✅ 暫存訂單資料已清理");

      // 提交事務
      await connection.commit();
      console.log("✅ 所有資料庫操作完成，事務已提交");

      res.json({
        success: true,
        message: "訂單創建成功",
        orderNo: orderNo,
        orderId: orderId,
        status: 'paid'
      });

    } catch (dbError) {
      await connection.rollback();
      console.error("❌ 資料庫操作失敗，事務已回滾:", dbError);
      throw dbError;
    }

  } catch (error) {
    console.error("確認訂單失敗:", error);
    res.status(500).json({
      success: false,
      message: "系統錯誤: " + error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// 讀取訂單詳情的 API
router.get("/orders/:orderId", async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const { orderId } = req.params;

    console.log("讀取訂單詳情:", orderId);

    // 查詢訂單主資料
    const [orderRows] = await connection.execute(`
      SELECT 
        id, order_number, user_id, total_amount, buyer_name, buyer_email, 
        buyer_phone, recipient_name, recipient_phone, postal_code, address,
        create_at
      FROM orders 
      WHERE id = ?
    `, [orderId]);

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到訂單"
      });
    }

    const order = orderRows[0];

    // 查詢訂單商品明細
    const [itemRows] = await connection.execute(`
      SELECT 
        oi.product_id, oi.quantity, oi.price, oi.size, oi.color, oi.material,
        p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `, [orderId]);

    res.json({
      success: true,
      data: {
        ...order,
        items: itemRows
      }
    });

  } catch (error) {
    console.error("讀取訂單詳情失敗:", error);
    res.status(500).json({
      success: false,
      message: "系統錯誤: " + error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// 後端接收綠界回傳的資料（保留作為備份機制，但在 localhost 環境下不會被觸發）
router.post("/ecpay/return", async (req, res) => {
  console.log("收到綠界回調（注意：localhost 環境下此回調不會被觸發）");
  console.log("回調資料:", req.body);

  // 由於使用 localhost，這個回調實際上不會被綠界呼叫
  // 訂單創建邏輯已移至前端 ClientBackURL 處理

  // 必須回傳 1|OK 給綠界（雖然在 localhost 環境下不會收到）
  res.send("1|OK");
});

// === 定期清理過期的暫存資料 ===
setInterval(() => {
  if (global.pendingOrders) {
    const now = new Date();
    let cleanedCount = 0;

    for (const [orderNo, orderData] of global.pendingOrders.entries()) {
      if (now > orderData.expires_at) {
        global.pendingOrders.delete(orderNo);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🗑️ 清理了 ${cleanedCount} 筆過期的暫存訂單`);
    }
  }
}, 10 * 60 * 1000); // 每10分鐘清理一次

export default router;