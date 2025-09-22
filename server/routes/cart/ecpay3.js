import express from "express";
import crypto from "crypto";
import ecpay_payment from "ecpay_aio_nodejs";
import dotenv from "dotenv";
dotenv.config();
import pool from "../../connect.js";

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
      originalAmount, // 新增：原始金額
      discountAmount, // 新增：折扣金額
      coupon, // 新增：優惠券資訊
      couponId, // 新增：優惠券ID
      coupon_id,
      userId,
      buyerName,
      buyerEmail,
      buyerPhone,
      recipientName,
      recipientPhone,
      address,
      deliveryMethod,
      storeName,
      storeAddress
    } = req.body;

    // 特別處理 cartItems
    let cartItems;
    const cartItemsRaw =
      req.body.cartItems || req.body.cart_items || req.body.items;

    console.log("cartItems 原始資料:");
    console.log("cartItemsRaw:", cartItemsRaw);
    console.log("cartItemsRaw 型別:", typeof cartItemsRaw);

    // 先解析 cartItemsRaw 成 cartItems
    if (typeof cartItemsRaw === "string") {
      try {
        cartItems = JSON.parse(cartItemsRaw);
        console.log("從字串解析的 cartItems:", cartItems);
      } catch (error) {
        console.error("cartItems JSON 解析失敗:", error);
        return res.status(400).json({
          status: "fail",
          message: "購物車資料格式錯誤: " + error.message,
        });
      }
    } else if (Array.isArray(cartItemsRaw)) {
      cartItems = cartItemsRaw;
      console.log("直接使用陣列 cartItems:", cartItems);
    } else {
      console.error("cartItems 格式不正確:", cartItemsRaw);
      return res.status(400).json({
        status: "fail",
        message: "購物車資料格式不正確，收到的資料類型: " + typeof cartItemsRaw,
      });
    }

    // 現在才檢查已解析的 cartItems
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "購物車資料為空或格式錯誤",
      });
    }

    console.log("最終 cartItems:", cartItems);
    console.log("cartItems 是陣列:", Array.isArray(cartItems));
    console.log("cartItems 長度:", cartItems?.length);

    // === 處理配送地址：根據配送方式決定最終地址 ===
    let finalAddress = address; // 預設使用原始地址
    let finalDeliveryMethod = deliveryMethod || "宅配";

    console.log("=== 處理配送方式和地址 ===");
    console.log("deliveryMethod:", deliveryMethod);
    console.log("原始 address:", address);
    console.log("storeName:", storeName);
    console.log("storeAddress:", storeAddress);

    if (deliveryMethod === "超商自取") {
      // 超商自取：驗證門市資訊並替換地址
      if (!storeName || !storeAddress) {
        return res.status(400).json({
          status: "fail",
          message: "超商自取需要提供門市名稱和地址"
        });
      }

      // 將地址替換為格式化的門市資訊
      finalAddress = `${storeName} - ${storeAddress}`;

      console.log("✅ 超商自取 - 地址已更新為:", finalAddress);
    } else {
      // 宅配：使用原始收件地址
      console.log("✅ 宅配 - 使用原始收件地址:", finalAddress);
    }

    if (
      !totalAmount ||
      !userId ||
      !recipientName ||
      !recipientPhone ||
      !finalAddress
    ) {
      return res.status(400).json({
        status: "fail",
        message:
          "缺少必要資訊：totalAmount, userId, recipientName, recipientPhone, address",
      });
    }

    // === 1. 驗證商品資料與計算金額 ===
    let calculatedAmount = 0;
    const validatedItems = [];

    for (const item of cartItems) {
      console.log("處理商品:", item);

      // 從資料庫取得商品最新資訊（價格、庫存等）
      const [products] = await connection.execute(
        `
        SELECT id, name, price FROM products WHERE id = ?
      `,
        [item.product_id || item.id]
      );

      if (!products || products.length === 0) {
        return res.status(400).json({
          status: "fail",
          message: `找不到商品 ID: ${item.product_id || item.id}`,
        });
      }

      const product = products[0];
      console.log("找到商品:", product);

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
        material: item.material || null,
      });
    }

    console.log("=== 金額驗證 ===");
    console.log("計算的商品總金額:", calculatedAmount);
    console.log("前端傳入的原始金額:", originalAmount);
    console.log("前端傳入的折扣金額:", discountAmount || 0);
    console.log("前端傳入的最終金額:", totalAmount);

    // === 2. 處理優惠券邏輯（根據實際的 coupons 資料表結構）===
    let validatedDiscountAmount = 0;
    let appliedCoupon = null;

    // 修正：從多個來源獲取 coupon_id
    let actualCouponId = null;

    console.log("=== 開始解析優惠券 ID ===");
    console.log("req.body.coupon_id:", req.body.coupon_id);
    console.log("req.body.coupon:", req.body.coupon);
    console.log("couponId 參數:", couponId);

    // 優先使用 coupon 物件中的 coupon_id
    if (coupon?.coupon_id) {
      actualCouponId = coupon.coupon_id;
      console.log("從 coupon.coupon_id 獲取:", actualCouponId);
    } else if (coupon_id) {
      actualCouponId = coupon_id;
      console.log("從 coupon_id 參數獲取:", actualCouponId);
    } else if (couponId) {
      actualCouponId = couponId;
      console.log("從 couponId 參數獲取 (備用):", actualCouponId);
    }

    console.log("=== 優惠券ID確認 ===");
    console.log("coupon 物件:", coupon);
    console.log("couponId 參數:", couponId);
    console.log("最終使用的 coupon_id:", actualCouponId);

    if (coupon && actualCouponId) {
      console.log("=== 開始驗證優惠券 ===");
      console.log("優惠券ID:", actualCouponId);
      console.log("用戶ID:", userId);
      console.log("優惠券資訊:", coupon);

      try {
        // 檢查用戶是否擁有此優惠券且未使用
        console.log("檢查用戶優惠券...");

        const [userCoupons] = await connection.execute(
          `
      SELECT 
        uc.*,
        c.name as coupon_name,
        c.code,
        c.discount_type,
        c.discount,
        c.min_discount,
        c.max_amount,
        c.start_at,
        c.end_at,
        c.valid_days,
        c.is_valid
      FROM user_coupons uc
      JOIN coupons c ON uc.coupon_id = c.id
      WHERE uc.user_id = ? 
        AND uc.coupon_id = ? 
        AND uc.status = 0
        AND c.is_valid = 1
        AND (uc.expire_at IS NULL OR uc.expire_at > NOW())
        AND (c.end_at IS NULL OR c.end_at >= CURDATE())
    `,
          [userId, actualCouponId]
        );

        console.log("用戶優惠券查詢結果:", userCoupons);
        console.log("找到的優惠券數量:", userCoupons.length);

        if (userCoupons && userCoupons.length > 0) {
          const userCoupon = userCoupons[0];
          console.log("找到有效的用戶優惠券:", userCoupon);

          // 檢查最低消費金額
          if (
            userCoupon.min_discount &&
            calculatedAmount < userCoupon.min_discount
          ) {
            throw new Error(
              `此優惠券需滿 ${userCoupon.min_discount} 元才能使用，目前金額 ${calculatedAmount} 元`
            );
          }

          // 重新計算折扣金額進行驗證
          console.log("開始重新計算折扣金額...");
          console.log("折扣類型 (discount_type):", userCoupon.discount_type);
          console.log("折扣值 (discount):", userCoupon.discount);
          console.log("商品總金額:", calculatedAmount);
          console.log("最大金額限制 (max_amount):", userCoupon.max_amount);

          // 根據 discount_type 計算折扣
          // 假設: 1 = 固定金額折扣, 2 = 百分比折扣
          if (userCoupon.discount_type === 1) {
            // 固定金額折扣
            validatedDiscountAmount = Math.min(
              userCoupon.discount,
              calculatedAmount
            );
            console.log(
              `固定折扣計算: min(${userCoupon.discount}, ${calculatedAmount}) = ${validatedDiscountAmount}`
            );
          } else if (userCoupon.discount_type === 2) {
            // 百分比折扣
            const discountRate = userCoupon.discount;
            console.log("百分比折扣率:", discountRate);

            if (discountRate >= 10 && discountRate <= 100) {
              // 如果是 95，表示 95 折 (5% 折扣)
              validatedDiscountAmount = Math.floor(
                (calculatedAmount * (100 - discountRate)) / 100
              );
              console.log(
                `${discountRate}折計算: ${calculatedAmount} * (100-${discountRate})/100 = ${validatedDiscountAmount}`
              );
            } else if (discountRate > 0 && discountRate < 1) {
              // 如果是 0.05，表示 5% 折扣
              validatedDiscountAmount = Math.floor(
                calculatedAmount * (1 - discountRate)
              );
              console.log(
                `小數折扣計算: ${calculatedAmount} * ${discountRate} = ${validatedDiscountAmount}`
              );
            } else if (discountRate >= 1 && discountRate < 10) {
              // 如果是 5，表示 5% 折扣
              validatedDiscountAmount = Math.floor(
                calculatedAmount * (discountRate / 100)
              );
              console.log(
                `百分比折扣計算: ${calculatedAmount} * ${discountRate}/100 = ${validatedDiscountAmount}`
              );
            } else {
              console.error("無法識別的折扣率:", discountRate);
              throw new Error(`無法識別的折扣率: ${discountRate}`);
            }

            // 檢查最大金額限制
            if (
              userCoupon.max_amount &&
              validatedDiscountAmount > userCoupon.max_amount
            ) {
              console.log(
                `折扣金額 ${validatedDiscountAmount} 超過最大限制 ${userCoupon.max_amount}，調整為最大限制`
              );
              validatedDiscountAmount = userCoupon.max_amount;
            }
          } else {
            console.error("未知的折扣類型:", userCoupon.discount_type);
            throw new Error(`未知的折扣類型: ${userCoupon.discount_type}`);
          }

          appliedCoupon = userCoupon;
          console.log("後端重新計算的折扣金額:", validatedDiscountAmount);
          console.log("前端傳入的折扣金額:", discountAmount);

          // 驗證折扣金額是否一致（允許1元誤差）
          const discountDiff = Math.abs(
            validatedDiscountAmount - (discountAmount || 0)
          );
          console.log("折扣金額差異:", discountDiff);

          if (discountDiff > 1) {
            console.error("折扣金額驗證失敗");
            return res.status(400).json({
              status: "fail",
              message: `折扣金額驗證失敗，後端計算: ${validatedDiscountAmount}, 前端傳入: ${discountAmount}, 差異: ${discountDiff}`,
            });
          }

          console.log("折扣金額驗證通過");
        } else {
          console.error("找不到有效的用戶優惠券");

          // 進一步檢查原因
          const [debugCheck] = await connection.execute(
            `
        SELECT 
          uc.*,
          c.name as coupon_name,
          c.is_valid,
          c.end_at,
          CASE 
            WHEN c.is_valid = 0 THEN '優惠券已停用'
            WHEN uc.status = 1 THEN '優惠券已使用'
            WHEN uc.expire_at < NOW() THEN '用戶優惠券已過期'
            WHEN c.end_at < CURDATE() THEN '優惠券活動已結束'
            WHEN uc.user_id != ? THEN '非本人優惠券'
            ELSE '未知原因'
          END as reason
        FROM user_coupons uc
        LEFT JOIN coupons c ON uc.coupon_id = c.id
        WHERE uc.coupon_id = ?
      `,
            [userId, actualCouponId]
          );

          console.log("優惠券狀態檢查:", debugCheck);

          if (debugCheck.length === 0) {
            throw new Error(`優惠券不存在 (ID: ${actualCouponId})`);
          } else {
            const userCouponRecord = debugCheck.find(
              (d) => d.user_id == userId
            );
            if (userCouponRecord) {
              throw new Error(`優惠券不可用: ${userCouponRecord.reason}`);
            } else {
              throw new Error(`用戶未擁有此優惠券 (ID: ${actualCouponId})`);
            }
          }
        }
      } catch (error) {
        console.error("優惠券處理過程發生錯誤:", error);
        console.error("錯誤訊息:", error.message);

        // 如果有折扣但驗證失敗，回傳具體錯誤
        if (discountAmount && discountAmount > 0) {
          return res.status(400).json({
            status: "fail",
            message: `優惠券驗證失敗: ${error.message}`,
          });
        }

        // 如果沒有折扣，則忽略優惠券錯誤
        console.log("忽略優惠券錯誤，繼續處理付款");
        validatedDiscountAmount = 0;
        appliedCoupon = null;
      }
    } else {
      console.log("=== 沒有優惠券資訊 ===");

      // 沒有優惠券，但前端傳了折扣金額
      if (discountAmount && discountAmount > 0) {
        console.warn("沒有優惠券資訊但有折扣金額，直接使用前端傳入的折扣");
        validatedDiscountAmount = discountAmount;
      }
    }

    console.log("=== 優惠券處理完成 ===");
    console.log("最終折扣金額:", validatedDiscountAmount);
    console.log("應用的優惠券:", appliedCoupon);

    // === 3. 最終金額驗證 ===
    const expectedFinalAmount = calculatedAmount - validatedDiscountAmount;

    console.log("=== 最終金額驗證 ===");
    console.log("商品原始總金額:", calculatedAmount);
    console.log("優惠券折扣:", validatedDiscountAmount);
    console.log("計算的最終金額:", expectedFinalAmount);
    console.log("前端傳入的最終金額:", totalAmount);

    // 驗證最終金額（允許1元的誤差）
    if (Math.abs(expectedFinalAmount - parseInt(totalAmount)) > 1) {
      return res.status(400).json({
        status: "fail",
        message: `最終金額驗證失敗，計算金額: ${calculatedAmount}, 折扣: ${validatedDiscountAmount}, 預期最終金額: ${expectedFinalAmount}, 傳入金額: ${totalAmount}`,
      });
    }

    console.log("金額驗證通過！");

    // === 2. 生成訂單編號 ===
    const TradeNo = "ORD" + Date.now() + userId;

    // === 3. 準備綠界付款參數 ===
    const now = new Date();
    const MerchantTradeDate =
      now.getFullYear() +
      "/" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "/" +
      String(now.getDate()).padStart(2, "0") +
      " " +
      String(now.getHours()).padStart(2, "0") +
      ":" +
      String(now.getMinutes()).padStart(2, "0") +
      ":" +
      String(now.getSeconds()).padStart(2, "0");

    // 處理商品名稱
    let itemName = validatedItems.map((item) => item.product_name).join("#");
    if (itemName.length > 400) {
      itemName = itemName.substring(0, 397) + "...";
    }

    let base_param = {
      MerchantID: MERCHANTID || "2000132",
      PaymentType: "aio",
      MerchantTradeNo: TradeNo,
      MerchantTradeDate,
      TotalAmount: expectedFinalAmount.toString(), // 使用折扣後的金額
      TradeDesc:
        validatedDiscountAmount > 0
          ? `線上購物付款 (原價${calculatedAmount}元，優惠${validatedDiscountAmount}元)`
          : "線上購物付款",
      ItemName: itemName,
      ReturnURL: `${HOST}/cart`,
      ClientBackURL: `${HOST}/cart/fin?orderNo=${TradeNo}`,
      ChoosePayment: "ALL",
      EncryptType: 1,
    };

    console.log("=== 準備暫存訂單資料 ===");
    console.log("actualCouponId:", actualCouponId);
    console.log("appliedCoupon:", appliedCoupon);
    console.log("validatedDiscountAmount:", validatedDiscountAmount);

    // === 4. 將訂單資料暫存到 session 或記憶體中 ===
    global.pendingOrders = global.pendingOrders || new Map();
    global.pendingOrders.set(TradeNo, {
      user_id: userId,
      buyer_name: buyerName || "購買者",
      buyer_email: buyerEmail || null,
      buyer_phone: buyerPhone || null,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      address: finalAddress,
      delivery_method: finalDeliveryMethod,
      original_amount: calculatedAmount, // 原始金額
      discount_amount: validatedDiscountAmount, // 折扣金額
      total_amount: expectedFinalAmount, // 最終金額
      applied_coupon: appliedCoupon, // 使用的優惠券
      cart_items: validatedItems,
      payment_status: "pending", // 添加這行
      payment_method: "信用卡",
      coupon_id: actualCouponId,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1小時後過期
    });

    console.log("✅ 訂單資料已暫存, 付款參數:", base_param);
    console.log("=== 暫存資料確認 ===");
    console.log("actualCouponId:", actualCouponId);
    console.log("appliedCoupon:", appliedCoupon);
    console.log("暫存地址:", finalAddress);
    console.log("配送方式:", finalDeliveryMethod);

    // === 5. 產生付款頁面並跳轉 ===
    const create = new ecpay_payment(options);
    const html = create.payment_client.aio_check_out_all(base_param);

    res.send(html);
  } catch (error) {
    console.error("❌ 處理付款請求失敗:", error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
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
        message: "缺少訂單編號",
      });
    }

    console.log("確認訂單:", orderNo);

    // 從暫存中取得訂單資料
    global.pendingOrders = global.pendingOrders || new Map();
    const orderData = global.pendingOrders.get(orderNo);
    console.log("暫存的訂單資料:");
    console.log("orderData:", JSON.stringify(orderData, null, 2));
    console.log("orderData.coupon_id:", orderData.coupon_id);
    console.log("orderData.applied_coupon:", orderData.applied_coupon);
    console.log(
      "orderData.applied_coupon?.coupon_id:",
      orderData.applied_coupon?.coupon_id
    );

    if (!orderData) {
      return res.status(404).json({
        success: false,
        message: "找不到暫存的訂單資料，可能已過期",
      });
    }

    console.log("找到暫存訂單資料:", orderData);

    // 檢查是否過期
    if (new Date() > orderData.expires_at) {
      global.pendingOrders.delete(orderNo);
      return res.status(404).json({
        success: false,
        message: "訂單資料已過期",
      });
    }

    await connection.beginTransaction();

    try {

      // 在這裡加入 debug 程式碼
      console.log("=== 詳細的 Debug 資訊 ===");
      console.log("orderData.coupon_id:", orderData.coupon_id);
      console.log("orderData.coupon_id 的型別:", typeof orderData.coupon_id);
      console.log("orderData.applied_coupon:", orderData.applied_coupon);

      const finalCouponId = orderData.coupon_id || null;
      console.log("最終 coupon_id:", finalCouponId);
      console.log("最終 coupon_id 型別:", typeof finalCouponId);
      console.log("是否為 null:", finalCouponId === null);
      console.log("是否為 undefined:", finalCouponId === undefined);


      // 創建正式訂單記錄
      const [orderResult] = await connection.execute(
        `
        INSERT INTO orders (
          order_number, 
          user_id, 
          total_amount, 
          buyer_name, 
          buyer_email, 
          buyer_phone, 
          recipient_name, 
          recipient_phone, 
          address,
          delivery_method,
          payment_status,
          payment_method,
          coupon_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?)
      `,
        [
          orderNo,
          orderData.user_id,
          orderData.total_amount,
          orderData.buyer_name,
          orderData.buyer_email,
          orderData.buyer_phone,
          orderData.recipient_name,
          orderData.recipient_phone,
          orderData.address,
          orderData.delivery_method,
          "paid",
          "信用卡",
          finalCouponId,
        ]
      );

      const orderId = orderResult.insertId;
      console.log("✅ 訂單主表創建成功, ID:", orderId);
      console.log("✅ 已保存配送方式:", orderData.delivery_method);
      console.log("✅ 已保存地址:", orderData.address);

      // 創建訂單明細
      let itemCount = 0;
      for (const item of orderData.cart_items) {
        await connection.execute(
          `
          INSERT INTO order_items (
            order_id, 
            product_id, 
            quantity, 
            price, 
            size, 
            color, 
            material
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
          [
            orderId,
            item.product_id,
            item.quantity,
            item.price,
            item.size,
            item.color,
            item.material,
          ]
        );
        itemCount++;
      }

      console.log(`✅ 訂單明細創建成功: ${itemCount} 項商品`);

      // 在創建訂單明細後，提交事務前加入
      if (orderData.applied_coupon && orderData.coupon_id) {
        await connection.execute(`
          UPDATE user_coupons 
          SET status = 1, used_at = NOW() 
          WHERE user_id = ? AND coupon_id = ? AND status = 0`
          , [orderData.user_id, orderData.coupon_id]);

        console.log("✅ 優惠券狀態已更新為已使用");
      }

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
        status: "paid",
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
      message: "系統錯誤: " + error.message,
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
    const [orderRows] = await connection.execute(
      `
      SELECT 
         id, order_number, user_id, total_amount, create_at,
          buyer_name, buyer_email, buyer_phone,
          recipient_name, recipient_phone, address,
          payment_method, payment_status, delivery_method
      FROM orders WHERE id = ?
    `,
      [orderId]
    );

    if (orderRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "找不到訂單",
      });
    }

    const order = orderRows[0];

    // 查詢訂單商品明細
    const [itemRows] = await connection.execute(
      `
      SELECT 
        oi.product_id, oi.quantity, oi.price, oi.size, oi.color, oi.material,
        p.name as product_name
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `,
      [orderId]
    );

    res.json({
      success: true,
      data: {
        ...order,
        items: itemRows,
      },
    });
  } catch (error) {
    console.error("讀取訂單詳情失敗:", error);
    res.status(500).json({
      success: false,
      message: "系統錯誤: " + error.message,
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
