"use client"

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function CartEcpayCheck() {
  const [countdown, setCountdown] = useState(3);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showManualButton, setShowManualButton] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const formRef = useRef(null);
  const router = useRouter();

  
  useEffect(() => {
      const orderData = JSON.parse(localStorage.getItem("cart"));
      const totalData = JSON.parse(localStorage.getItem("totalAmount"));
    // 從後端 API 獲取綠界付款參數
    const fetchPaymentData = async () => {
      try {
        const response = await fetch("http://localhost:3005/api/cart/ecpay", {
          method: "POST",
          header: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalAmount: totalData,
            itemName: orderData.name,
          }),
        });

        const data = await response.json();
        setPaymentData(data.paymentData); //後端回傳付款參數物件
      } catch (error) {
        console.error("獲取付款資料失敗:", error);
        setShowManualButton(true);
      }
    };
    fetchPaymentData();
  }, []);

  useEffect(() => {
    if (!paymentData) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentData]);

  const handleAutoSubmit = () => {
    setIsSubmitting(true);

    // 直接提交 React 表單
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.submit();
      } else {
        setShowManualButton(true);
        setIsSubmitting(false);
      }
    }, 100);
  };

  const handleManualSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    } else {
      alert("付款表單載入失敗，請重新整理頁面");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  if (!paymentData) {
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
              : `${countdown} 秒後自動跳轉`}
          </p>
        </div>

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
              <span className="font-medium">{orderData.items}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-gray-600">付款金額:</span>
              <span className="font-bold text-green-600 text-lg">
                NT$ {orderData.amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isSubmitting && (
          <div className="flex justify-center mb-6">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
          </div>
        )}

        {/* 安全的 React 表單 - 不使用 dangerouslySetInnerHTML */}
        <form
          ref={formRef}
          method="POST"
          action={
            paymentData.action ||
            "https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5"
          }
          style={{ display: "none" }}
        >
          {/* 動態生成隱藏輸入欄位 */}
          {Object.entries(paymentData.params || {}).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>

        {/* Action Buttons */}
        <div className="space-y-3">
          {showManualButton && (
            <button
              onClick={handleManualSubmit}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
            >
              前往付款
            </button>
          )}

          <button
            onClick={handleGoBack}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
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
