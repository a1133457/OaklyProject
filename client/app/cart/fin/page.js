"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "@/hooks/use-fetch";
import Link from "next/link";
import CartCard from "../_components/cartCard";
import Gradation from "../_components/gradation";
import GreenButton from "../_components/greenButton";
import Total from "../_components/total";
import WhiteButton from "../_components/whiteButton";
import "/styles/cart/cartFin.css";
import CartCoupon from "@/app/user/coupon/_components/CartCoupon";

function CartFinContent() {
  const [pageStatus, setPageStatus] = useState("loading"); // loading, success, error, default
  const [orderData, setOrderData] = useState(null);
  const [message, setMessage] = useState("處理中...");
  const [couponData, setCouponData] = useState([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // 清空 localStorage 的函數
    const clearCartData = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("cart");
        localStorage.removeItem("selectedCoupon");
        localStorage.removeItem("orderData");
        localStorage.removeItem("finalAmount");
        localStorage.removeItem("buyer");
        localStorage.removeItem("recipient");
        localStorage.removeItem("store711");
        localStorage.removeItem("payment");
        localStorage.removeItem("delivery");
        localStorage.removeItem("invoice");
        console.log("✅ localStorage 已清理");
      }
    };

    // 監聽頁面即將離開的事件
    const handleBeforeUnload = () => {
      clearCartData();
    };

    // 監聽頁面隱藏事件（更可靠）
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        clearCartData();
      }
    };

    // 監聽頁面離開事件
    const handlePageHide = () => {
      clearCartData();
    };

    // 綁定事件監聽器
    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    // 針對 Next.js 路由變化的處理
    const handleRouteChange = () => {
      clearCartData();
    };

    // 如果使用 Next.js router，監聽路由變化
    if (router.events) {
      router.events.on("routeChangeStart", handleRouteChange);
    }

    // 清理函數：組件卸載時移除事件監聽器
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);

      if (router.events) {
        router.events.off("routeChangeStart", handleRouteChange);
      }
    };
  }, [router]);

  useEffect(() => {
    const userCoupons = localStorage.getItem("selectedCoupon");
    console.log("selectedCoupon 原始值:", userCoupons);
    console.log("selectedCoupon 類型:", typeof userCoupons);
    console.log("selectedCoupon 是否為 null:", userCoupons === null);

    if (userCoupons) {
      try {
        // 轉換成物件
        const couponData = JSON.parse(userCoupons);
        console.log("couponData", couponData);

        // 檢查是否為陣列，如果不是就轉成陣列
        if (Array.isArray(couponData)) {
          setCouponData(couponData);
        } else {
          // 單一優惠券物件，包裝成陣列
          setCouponData([couponData]);
        }
        // 使用資料
        console.log("取得優惠券資料:", couponData);
      } catch (error) {
        console.error("解析 localStorage 資料失敗:", error);
        setCouponData([]);
      }
    } else {
      console.log("沒有找到 selectedCoupon 資料");
      setCouponData([]);
    }
  }, []);

  useEffect(() => {
    console.log("頁面載入，檢查 URL 參數");
    console.log(
      "完整 URL:",
      typeof window !== "undefined" ? window.location.href : "SSR"
    );

    const orderNo = searchParams.get("orderNo");
    console.log("讀取到的 orderNo:", orderNo);

    // 如果沒有 orderNo，表示是直接訪問此頁面，顯示預設內容
    if (!orderNo) {
      console.log("沒有 orderNo，顯示預設頁面");
      setPageStatus("default");
      return;
    }

    // 如果有 orderNo，處理訂單流程
    handleOrderProcess(orderNo);
  }, [searchParams]);

  const handleOrderProcess = async (orderNo) => {
    try {
      // 在處理訂單前先保存優惠券數據
      const savedCoupons = localStorage.getItem("selectedCoupon");
      let parsedCoupons = [];

      if (savedCoupons) {
        try {
          const couponData = JSON.parse(savedCoupons);
          parsedCoupons = Array.isArray(couponData) ? couponData : [couponData];
        } catch (error) {
          console.error("解析優惠券數據失敗:", error);
        }
      }

      // ... 原有的訂單處理邏輯 ...

      // 1. 確認付款並創建訂單（一步完成）
      const confirmResponse = await fetch(
        "http://localhost:3005/api/cart/ecpay/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderNo }),
        }
      );

      const confirmResult = await confirmResponse.json();
      console.log("確認結果:", confirmResult);

      if (!confirmResult.success) {
        setPageStatus("error");
        setMessage(confirmResult.message || "訂單確認失敗");
        return;
      }

      // 2. 從資料庫讀取剛創建的完整訂單資料
      setMessage("正在讀取訂單資料...");
      const orderResponse = await fetch(
        `http://localhost:3005/api/cart/orders/${confirmResult.orderId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const orderResult = await orderResponse.json();
      console.log("訂單資料:", orderResult);

      if (!orderResult.success) {
        setPageStatus("error");
        setMessage("讀取訂單資料失敗: " + orderResult.message);
        return;
      }
      // 3. 設置成功狀態和資料（包含優惠券）
      setPageStatus("success");
      setOrderData({
        ...confirmResult,
        ...orderResult.data,
        usedCoupons: parsedCoupons, // 保存使用的優惠券
      });
      setCouponData(parsedCoupons); // 確保 couponData 有數據

      console.log("開始處理訂單:", orderNo);
      setMessage("正在確認付款並建立訂單...");


    } catch (error) {
      console.error("處理訂單時發生錯誤:", error);
      setPageStatus("error");
      setMessage("系統錯誤，請聯繫客服: " + error.message);
    }
  };

  // 格式化日期時間
  const formatDateTime = (dateString) => {
    if (!dateString) return new Date().toLocaleString("zh-TW");
    return new Date(dateString).toLocaleString("zh-TW");
  };

  // 載入中狀態
  if (pageStatus === "loading") {
    return (
      <div className="container-fluid">
        <Gradation />
        <div className="cart">
          <div className="main-side pc">
            <div className="cart-main-first pc">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2>處理付款結果中...</h2>
              <h4>{message}</h4>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 錯誤狀態
  if (pageStatus === "error") {
    return (
      <div className="container-fluid">
        <Gradation />
        <div className="cart">
          <div className="main-side pc">
            <div className="cart-main-first pc">
              <h2>處理失敗</h2>
              <i
                className="fa-regular fa-circle-xmark"
                style={{ color: "red", fontSize: "48px" }}
              ></i>
              <h4>{message}</h4>
              <div className="info-button pc" style={{ marginTop: "20px" }}>
                <button
                  onClick={() => router.push("/cart")}
                  className="btn btn-primary"
                >
                  返回購物車
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 成功狀態或預設狀態 - 顯示訂單完成頁面
  return (
    <div className="container-fluid">
      <Gradation />
      <div className="cart">
        <div className="main-side pc">
          <div className="cart-main-first pc">
            <h2>完成訂單</h2>
            <i className="fa-regular fa-circle-check"></i>
            <h4>
              {pageStatus === "success"
                ? "您的付款已成功，訂單已建立！"
                : "您的訂單已成功成立，我們將盡快為您處理！"}
            </h4>
          </div>

          <div className="cart-main-first fin-card pc">
            <h4>
              訂單編號:{" "}
              {orderData?.order_number || orderData?.orderNo || "14356457856"}
            </h4>

            {/* 顯示從資料庫取得的商品資料 */}

            <CartCard />

            <div className="orange-side fin pc">

              <Total />
            </div>
          </div>

          <div className="cart-main-first fin-card pc">
            <h4>訂單資訊</h4>
            <div className="fin-info pc">
              <div className="orange-side pc">
                <div className="information pc">
                  <div className="info-1 pc">
                    <h6>成立時間</h6>
                    <h6>付款狀態</h6>
                    <h6>付款方式</h6>
                  </div>
                  <div className="info-2 pc">
                    <p>{formatDateTime(orderData?.create_at)}</p>
                    <p>
                      {orderData?.status === "paid"
                        ? "已付款"
                        : pageStatus === "success"
                          ? "已付款"
                          : "已付款"}
                    </p>
                    <p>{orderData?.payment_method}</p>
                  </div>
                </div>
              </div>
              <div className="orange-side pc">
                <div className="information pc">
                  <div className="info-1 pc">
                    <h6>收件人</h6>
                    <h6>收件人電話</h6>
                    <h6>收件地址</h6>
                  </div>
                  <div className="info-2 pc">
                    <p>{orderData?.recipient_name}</p>
                    <p>{orderData?.recipient_phone}</p>
                    <p>{orderData?.address}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="info-button pc">
            <WhiteButton
              step="檢視訂單詳情"
              to={"/user/order"}
            />
            <GreenButton
              step="繼續購物"
              onClick={() => router.push("/products")}
            />
          </div>
        </div>

        {/* 手機版 ---------------------------------------------- */}
        <div className="main-side phone">
          <div className="cart-main-first phone">
            <h2>完成訂單</h2>
            <i className="fa-regular fa-circle-check"></i>
          </div>
          <div className="cart-main-first fin-card phone">
            <table className="fin-card-table">
              <tbody>
                <tr>
                  <th className="fin-card-title">
                    <i className="fa-solid fa-list-ul"></i>
                    <h6>訂單資訊</h6>
                  </th>
                </tr>
                <tr>
                  <td>
                    <table className="fin-card-details">
                      <tbody>
                        <tr>
                          <td>訂單編號</td>
                          <td>
                            {orderData?.order_number ||
                              orderData?.orderNo ||
                              "14356457856"}
                          </td>
                        </tr>
                        <tr>
                          <td>訂單金額</td>
                          <td>
                            NT${" "}
                            {orderData?.total_amount?.toLocaleString() || "0"}
                          </td>
                        </tr>
                        <tr>
                          <td>商品數量</td>
                          <td>{orderData?.items?.length || 1} 項商品</td>
                        </tr>
                        <tr>
                          <td>詳細資訊</td>
                          <td>
                            <Link href={`/orders/${orderData?.orderId || ""}`}>
                              前往查看
                            </Link>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <th className="fin-card-title">
                    <i className="fa-regular fa-credit-card"></i>
                    <h6>付款資訊</h6>
                  </th>
                </tr>
                <tr>
                  <td>
                    <table className="fin-card-details">
                      <tbody>
                        <tr>
                          <td>付款方式</td>
                          <td>信用卡</td>
                        </tr>
                        <tr>
                          <td>付款狀態</td>
                          <td>
                            {orderData?.status === "paid"
                              ? "已付款"
                              : pageStatus === "success"
                                ? "已付款"
                                : "已付款"}
                          </td>
                        </tr>
                        <tr>
                          <td>付款時間</td>
                          <td>
                            {formatDateTime(
                              orderData?.paid_at || orderData?.create_at
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td className="info-button">
                    <WhiteButton
                      step="繼續選購"
                      to="/products"
                    />
                    <p>
                      感謝訂購 Oakly 的商品，
                      {pageStatus === "success"
                        ? "付款已完成，我們會為您盡快處理"
                        : "已完成交易，我們會為您盡快處理"}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartFinPage() {
  return (
    <Suspense
      fallback={
        <div className="container-fluid">
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <div>載入中...</div>
          </div>
        </div>
      }
    >
      <CartFinContent />
    </Suspense>
  );
}
