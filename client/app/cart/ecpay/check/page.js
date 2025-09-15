"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CartEcpayCheck() {
  const [countdown, setCountdown] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({});
  const router = useRouter();

  useEffect(() => {
    console.log("=== 開始讀取 localStorage 資料 ===");

    // 從 localStorage 獲取訂單資料
    const storedOrderData = localStorage.getItem("orderData");
    const finalAmount = localStorage.getItem("finalAmount");
    const storedBuyer = localStorage.getItem("buyer");
    const storedRecipient = localStorage.getItem("recipient");

    console.log("Raw localStorage data:");
    console.log("storedOrderData存在:", !!storedOrderData);
    console.log("finalAmount存在:", !!finalAmount);
    console.log("storedBuyer存在:", !!storedBuyer);
    console.log("storedRecipient存在:", !!storedRecipient);

    if (!storedOrderData || !finalAmount) {
      console.error("缺少關鍵資料");
      setError("找不到訂單資料，請重新下單");
      setShowManualButton(true);
      return;
    }

    try {
      const parseOrderData = JSON.parse(storedOrderData);
      const buyerData = storedBuyer ? JSON.parse(storedBuyer) : {};
      const recipientData = storedRecipient ? JSON.parse(storedRecipient) : {};

      console.log("Parsed data:", parseOrderData);
      console.log("buyerData:", buyerData);
      console.log("recipientData:", recipientData);

      // 安全的地址拼接函數
      const buildSafeAddress = (data) => {
        if (data.address) return data.address; // 如果已有完整地址直接使用
        
        const parts = [
          data.postcode,
          data.city,
          data.area,
          data.address
        ].filter(part => part && part !== '' && part !== 'undefined');
        return parts.join('');
      };

      const combinedShippingInfo = {
        // 購買人資料
        buyerName: buyerData.name || "",
        buyerEmail: buyerData.email || "",
        buyerPhone: buyerData.phone || "",
        buyerAddress: buildSafeAddress(buyerData),

        // 收件人資料
        recipientName: recipientData.name || "",
        recipientPhone: recipientData.phone || "",
        recipientAddress: buildSafeAddress(recipientData),

        // 相容欄位
        name: recipientData.name || buyerData.name || "",
        phone: recipientData.phone || buyerData.phone || "",
        address: buildSafeAddress(recipientData) || buildSafeAddress(buyerData),
        email: recipientData.email || buyerData.email || "",
        postcode: recipientData.postcode || buyerData.postcode || ""
      };

      console.log("Combined shippingInfo:", combinedShippingInfo);

      setOrderData(parseOrderData);
      setShippingInfo(combinedShippingInfo);

      // 檢查是否有收件資訊
      if (hasCompleteShippingInfo(combinedShippingInfo)) {
        console.log("收件資訊完整，啟動倒數計時");
        startCountdown(parseOrderData, parseInt(finalAmount));
      } else {
        console.log("收件資訊不完整，顯示手動按鈕");
        setShowManualButton(true);
      }

    } catch (error) {
      console.error("解析資料失敗:", error);
      console.error("錯誤詳情:", error.message);
      setError(`資料解析失敗: ${error.message}`);
      setShowManualButton(true);
    }
  }, [router]);

  // 檢查收件資訊是否完整 - 修正變數未定義問題
  const hasCompleteShippingInfo = (info) => {
    const hasRecipientInfo = info.recipientName && info.recipientPhone && info.recipientAddress;
    const hasCompatibleInfo = info.name && info.phone && info.address; // 定義這個變數

    console.log("檢查收件資訊完整性:");
    console.log("recipientName:", info.recipientName);
    console.log("recipientPhone:", info.recipientPhone);
    console.log("recipientAddress:", info.recipientAddress);
    console.log("name:", info.name);
    console.log("phone:", info.phone);
    console.log("address:", info.address);
    console.log("hasRecipientInfo:", hasRecipientInfo);
    console.log("hasCompatibleInfo:", hasCompatibleInfo);

    return hasRecipientInfo || hasCompatibleInfo;
  };

  // 啟動倒數計時
  const startCountdown = (orderInfo, amount) => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit(orderInfo, amount);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  // 自動提交到付款頁面
  const handleAutoSubmit = (orderInfo, amount) => {
    setIsSubmitting(true);
    submitPaymentForm(orderInfo, amount);
  };

  // 手動提交
  const handleManualSubmit = () => {
    if (!orderData) {
      setError("找不到訂單資料");
      return;
    }
    const finalAmount = localStorage.getItem("finalAmount");
    if (!finalAmount) {
      setError("找不到付款金額");
      return;
    }

    if (!hasCompleteShippingInfo(shippingInfo)) {
      setError("請先填寫完整的收件資訊");
      return;
    }

    setIsSubmitting(true);
    submitPaymentForm(orderData, parseInt(finalAmount));
  };

  // 提交付款表單到後端 - 修正所有資料解析問題
  const submitPaymentForm = (orderInfo, amount) => {
    try {
      // 修正：直接取得字串，不要重複解析
      const cartItemsRaw = localStorage.getItem("cart");
      const buyerDataRaw = localStorage.getItem("buyer");
      const recipientDataRaw = localStorage.getItem("recipient"); // 修正拼字錯誤

      console.log("Raw data from localStorage:");
      console.log("cartItemsRaw:", cartItemsRaw?.substring(0, 100) + "...");
      console.log("buyerDataRaw:", buyerDataRaw);
      console.log("recipientDataRaw:", recipientDataRaw);

      // 安全解析資料
      let cartItems = [];
      let buyerData = {};
      let recipientData = {};

      try {
        if (cartItemsRaw) cartItems = JSON.parse(cartItemsRaw);
        if (buyerDataRaw) buyerData = JSON.parse(buyerDataRaw);
        if (recipientDataRaw) recipientData = JSON.parse(recipientDataRaw);
      } catch (parseError) {
        console.error("解析資料失敗:", parseError);
        setError("資料格式錯誤，請重新整理");
        setIsSubmitting(false);
        return;
      }

      console.log("成功解析的資料:");
      console.log("cartItems:", cartItems);
      console.log("cartItems length:", cartItems?.length);
      console.log("cartItems is array:", Array.isArray(cartItems));
      console.log("buyerData:", buyerData);
      console.log("recipientData:", recipientData);

      // 檢查購物車資料
      if (!Array.isArray(cartItems) || cartItems.length === 0) {
        setError("購物車資料無效或為空");
        setIsSubmitting(false);
        return;
      }

      // 準備發送給後端的資料 - 修正欄位名稱
      const paymentRequest = {
        totalAmount: amount,
        userId: orderInfo.userId,

        // 購買人資訊
        buyerName: buyerData.name || shippingInfo.buyerName || '購買者',
        buyerEmail: buyerData.email || shippingInfo.buyerEmail || '',
        buyerPhone: buyerData.phone || shippingInfo.buyerPhone || '',

        // 收件人資訊
        recipientName: recipientData.name || shippingInfo.recipientName || buyerData.name || '收件人',
        recipientPhone: recipientData.phone || shippingInfo.recipientPhone || buyerData.phone || '',
        
        // 修正：使用 'postcode' 而不是 'postCode'
        postcode: recipientData.postcode || shippingInfo.postcode || '',
        address: recipientData.address || shippingInfo.recipientAddress || shippingInfo.address || '',

        // 購物車商品資料
        cartItems: cartItems.map(item => {
          if (!item || typeof item !== 'object') {
            console.warn("Invalid item:", item);
            return null;
          }

          return {
            product_id: item.id || item.product_id,
            quantity: item.quantity || 1,
            price: item.price || 0,
            size: item.size || null,
            color: item.color || null,
            material: item.material || null,
            name: item.name || '商品'
          };
        }).filter(item => item !== null)
      };

      console.log("準備提交付款表單:", paymentRequest);

      // 檢查必要欄位
      const missingFields = [];
      if (!paymentRequest.totalAmount) missingFields.push('totalAmount');
      if (!paymentRequest.userId) missingFields.push('userId');
      if (!paymentRequest.recipientName) missingFields.push('recipientName');
      if (!paymentRequest.recipientPhone) missingFields.push('recipientPhone');
      if (!paymentRequest.address) missingFields.push('address');
      if (!paymentRequest.cartItems || paymentRequest.cartItems.length === 0) missingFields.push('cartItems');

      if (missingFields.length > 0) {
        console.error("Missing required fields:", missingFields);
        setError(`缺少必要資訊: ${missingFields.join(', ')}`);
        setIsSubmitting(false);
        return;
      }

      // 創建表單
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'http://localhost:3005/api/cart/ecpay/create';
      form.style.display = 'none';

      // 添加所有付款參數
      Object.keys(paymentRequest).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;

        if (key === "cartItems") {
          input.value = JSON.stringify(paymentRequest[key]);
        } else {
          input.value = paymentRequest[key] || '';
        }
        form.appendChild(input);
      });

      console.log("Form created successfully, submitting...");

      // 提交表單
      document.body.appendChild(form);
      form.submit();

    } catch (error) {
      console.error("提交付款表單失敗:", error);
      console.error("錯誤堆疊:", error.stack);
      setError(`付款提交失敗: ${error.message}`);
      setIsSubmitting(false);
      setShowManualButton(true);
    }
  };

  // 從商品陣列中提取商品名稱
  const getItemNames = (items) => {
    if (!items || items.length === 0) return "商品";

    if (items.length === 1) {
      return items[0].name || "商品";
    } else {
      return `${items[0].name || "商品"} 等 ${items.length} 項商品`;
    }
  };

  // 處理收件資訊更新
  const handleShippingInfoChange = (field, value) => {
    const updatedInfo = { ...shippingInfo, [field]: value };
    setShippingInfo(updatedInfo);
    localStorage.setItem("shippingInfo", JSON.stringify(updatedInfo));
  };

  const handleGoBack = () => {
    router.back();
  };

  // 載入中畫面
  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              準備付款中...
            </h2>
            <p className="text-gray-600">正在初始化付款資訊</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">安全付款</h1>
          <p className="text-gray-600">
            {isSubmitting
              ? "正在跳轉至付款頁面..."
              : showManualButton
                ? "請確認資訊後點擊付款"
                : `${countdown} 秒後自動跳轉`}
          </p>
        </div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">訂單資訊</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">訂單編號:</span>
              <span className="font-medium">{orderData.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">商品:</span>
              <span className="font-medium">{getItemNames(orderData.items)}</span>
            </div>
            {orderData.discountAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">優惠券折抵:</span>
                <span className="text-red-500">-NT$ {orderData.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">付款金額:</span>
              <span className="font-bold text-green-600 text-lg">
                NT$ {orderData.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3">收件資訊</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">收件人:</span>
              <span className="font-medium">{shippingInfo.recipientName || shippingInfo.name || '未設定'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">電話:</span>
              <span className="font-medium">{shippingInfo.recipientPhone || shippingInfo.phone || '未設定'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">地址:</span>
              <span className="font-medium">{shippingInfo.recipientAddress || shippingInfo.address || '未設定'}</span>
            </div>
          </div>

          {/* 購買人資訊 */}
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-medium text-gray-700 mb-2">購買人資訊</h4>
            <div className="space-y-1 text-xs text-gray-600">
              <div>姓名: {shippingInfo.buyerName || '未設定'}</div>
              <div>Email: {shippingInfo.buyerEmail || '未設定'}</div>
              <div>電話: {shippingInfo.buyerPhone || '未設定'}</div>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isSubmitting && (
          <div className="flex justify-center mb-6">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          {(showManualButton || error) && (
            <button
              onClick={handleManualSubmit}
              disabled={isSubmitting}
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg ${isSubmitting
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {isSubmitting ? '處理中...' : '前往付款'}
            </button>
          )}

          <button
            onClick={handleGoBack}
            disabled={isSubmitting}
            className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 ${isSubmitting
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
          >
            返回購物車
          </button>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">🔒 您的交易資訊經過加密保護</p>
        </div>
      </div>
    </div>
  );
}