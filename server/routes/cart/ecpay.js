import express from "express";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// 綠界提供的 SDK
const ecpay_payment = require("ecpay_aio_nodejs");

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

router.get("/", (req, res) => {
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
  TradeNo = "test" + new Date().getTime();
  let base_param = {
    MerchantTradeNo: TradeNo, //這裡要 20 碼 uid
    MerchantTradeDate,
    TotalAmount: "100",
    TradeDesc: "測試交易描述",
    ItemName: "測試商品等",
    ReturnURL: `${HOST}/return`,
    ClientBackURL: `http://localhost:3000/payment?success=true`,
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
  console.log("req.body", req.body);

  const { CheckMacValue } = req.body;
  const data = { ...req.body };
  delete data.CheckMacValue; // 此段不驗證

  const create = new ecpay_payment(options);
  const checkValue = create.payment_client.helper.gen_chk_mac_value(data);

  console.log(
    "確認交易正確性:",
    CheckMacValue === checkValue,
    CheckMacValue,
    checkValue
  );

  //  交易成功後，需要回傳 1|ok 給綠界
  res.send("1|ok");
});

// 用戶交易完成的轉址，可以轉到完成訂單畫面
router.get("/clientReturn", (req, res) => {
  console.log("clientReturn:", req.body, req.query);
  res.render("return", { query: req.query });
});

const { RtnCode, RtnMsg, MerchantTradeNo } = req.query;
res.redirect(
  `http://localhost:3000/payment?RtnCode=${RtnCode}&RtnMsg=${RtnMsg}&TradeNo=${MerchantTradeNo}`
);

export default router;
