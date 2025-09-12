import express from "express";
import crypto from "crypto";
import ecpay_payment from "ecpay_aio_nodejs";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();



// 綠界提供的 SDK

const { MERCHANTID, HASHKEY, HASHIV, HOST } = process.env;

// SDK 提供的範例，初始化
// https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
const options = {
  OperationMode: "Test",
  MercProfile: {
    MerchantID: MERCHANTID,
    HashKey: HASHKEY,
    HashIV: HASHIV,
  },
  IgnorePayment: [
    //"Credit",
    // "WebATM"
  ],
  IsProjectContractor: false,
};
let TradeNo;

router.post("/", (req, res) => {
  const { totalAmount, cartItems } = req.body;
  // SDK 提供的範例，參數設定
  // https://github.com/ECPay/ECPayAIO_Node.js/blob/master/ECPAY_Payment_node_js/conf/config-example.js
  const MerchantTradeDate = new Date().toLocaleDateString("zh-tw", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  TradeNo = "ORDER" + new Date().getTime();
  let base_param = {
    MerchantID: "2000132",
    PaymentType: "aio",
    MerchantTradeNo: TradeNo, //這裡要 20 碼 uid
    MerchantTradeDate,
    TotalAmount: totalAmount,
    TradeDesc: "網路購物",
    ItemName: cartItems.map((item) => item.name).join("#"),
    ReturnURL: `${HOST}/cart/return`,
    ClientBackURL: `${HOST}/cart/fin`,
  };
  const create = new ecpay_payment(options);

  // 注意: 在此是直接提供 html + js 直接觸發的範例，直接從前端觸發付款行為 !!連這個 API 就會自動跳轉到，index.ejs 畫面，之後再轉到綠界 (可以改成自己的畫面)
  const html = create.payment_client.aio_check_out_all(base_param);
  console.log(html);

  res.json({
    success: true,
    html: html,
    tradeNo: TradeNo,
  });
});

// 後端接收綠界回傳的資料
router.post("/return", async (req, res) => {
  try {
    console.log("綠界回傳資料", req.body);

    const { CheckMacValue, MerchantTradeNo, RtnCode, RtnMsg, TradeAmt } =
      req.body;
    const data = { ...req.body };
    delete data.CheckMacValue; // 此段不驗證

    const create = new ecpay_payment(options);
    const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

    const isValid = CheckMacValue === checkValue;
    const isSuccess = RtnCode === "1";

    console.log("付款驗證結果:", {
      交易編號: MerchantTradeNo,
      金額: TradeAmt,
      驗證正確: isValid,
      付款成功: isSuccess,
    });

    if (!isValid && isSuccess) {
      // 更新訂單狀態為已付款

      console.log("付款成功，訂單已更新");
    } else {
      console.log("付款失敗或驗證失敗");
    }

    //  交易成功後，需要回傳 1|ok 給綠界
    res.send("1|ok");
  } catch (error) {
    console.error("處理付款回傳錯誤:", error);
    res.send("1|ok"); //即使有錯誤也要回傳，避免綠界重複通知
  }
});

// 用戶交易完成的轉址，可以轉到完成訂單畫面
router.get("/clientReturn", (req, res) => {
  console.log("付款結果頁面:", req.body, req.query);
  res.render("return", { query: req.query });
});


export default router;
