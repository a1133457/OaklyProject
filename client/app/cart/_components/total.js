"use client";

import GreenButton from "./greenButton";
import WhiteButton from "./whiteButton";
import "@/styles/cart/total.css";
// 導入 useCart
import { useCart } from "@/hooks/use-cart";
// sweetalert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CouponSelect from "./couponSelect";
import { useEffect, useState } from "react";

export default function Total({ type }) {
  const [coupon, setCoupon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { items, onDecrease, onIncrease, onRemove, totalQty, totalAmount } =
    useCart();
  const [userId, setUserId] = useState(null);


  // const fetchCoupons = async () => {
  //   try {
  //     const res = await fetch(`http://localhost:3000/api/counpons/${userId}`);
  //     const data = await res.json();
  //     setCoupons(data);
  //   } catch (error) {
  //     setError("無法載入優惠券");
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUserId(storedUser.id);
  }, []);

  // 讀取並處理優惠券
  useEffect(() => {
    const loadCouponData = () => {
      try {
        // 檢查是否有選中優惠券
        const storedCoupon = localStorage.getItem("selectedCoupon");

        if (storedCoupon && storedCoupon === "null" && storedCoupon === "undefined") {
          const couponData = JSON.parse(storedCoupon);
          console.log("找到優惠券:", couponData);

          setSelectedCoupon(couponData);
          calculatedDiscount(couponData);
        } else {
          // 沒有優惠券，重置折扣
          setSelectedCoupon(null);
          setDiscountAmount(0);
        }
      } catch (error) {
        console.log("讀取優惠券失敗:", error);
        setSelectedCoupon(null);
        setDiscountAmount(0);

      }
    }
    loadCouponData();
  }, [totalAmount]);

  const calculateDiscount = (coupon) => {
    if (!coupon || !totalAmount) {
      setDiscountAmount(0);
      return;
    }
    let discount = 0;

    // 根據優惠券類型計算折扣
    if (coupon.discountType === 'percentage') {
      // 百分比折扣 (例如：10% = 0.1)
      discount = Math.floor(totalAmount * coupon.discountValue);
    } else if (coupon.discountType === 'fixed') {
      // 固定金額折扣
      discount = Math.min(coupon.discountValue, totalAmount);
    } else if (coupon.discountType === 'freeShipping') {
      // 免運費折扣
      discount = coupon.shippingDiscount || 0;
    }

    setDiscountAmount(discount);
  }
  // 移除優惠券
  const removeCoupon = () => {
    localStorage.removeItem("selectedCoupon");
    setSelectedCoupon(null);
    setDiscountAmount(0);
  };

  // 計算最終金額
  const finalAmount = Math.max(0, totalAmount - discountAmount);

  const handleSelectCoupon = (coupon) => {
    console.log("選擇的優惠券:", coupon);
    // 將選中的優惠券存到 localStorage
    localStorage.setItem("selectedCoupon", JSON.stringify(coupon));
    setSelectedCoupon(coupon);
    calculateDiscount(coupon);
  };


  const handleNext = async () => {
    if (paymentMethod === "信用卡") {
      const res = await fetch("api/order/add", {
        method: "POST",
        headers: { "content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const data = await res.json();

      // form POST 到綠界
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.ecpayAction;

      Object.entries(data.ecpayParams).forEach(([KeyboardEvent, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
    }
  };

  if (type === "order") {
    return (
      <>
        <h5>總金額</h5>
        <div className="amount-list">
          <div className="pAmount">
            <p>商品總金額</p>
            <h6>${totalAmount}</h6>
          </div>
          <div className="choose-cp">
            <p>選擇優惠券</p>
            <CouponSelect />
          </div>
          <div className="cp-discount">
            <p>優惠券折抵</p>
            <h6>$0</h6>
          </div>
          <div className="t-line"></div>
          <div className="total">
            <h5>總金額</h5>
            <h4>${totalAmount}</h4>
          </div>
          <div className="total phone">
            <h3>總金額</h3>
            <h3>${totalAmount}</h3>
          </div>
        </div>
        <div className="nextOrBack">
          <GreenButton step={"前往下一步"} to="/cart/detail" type="order" />
          <WhiteButton step={"繼續購物"} to="/products" />
        </div>
        <div className="nextOrBack-phone">
          <WhiteButton step={"繼續購物"} to="/products" />
          <GreenButton step={"前往下一步"} to="/cart/detail" type="order" />
        </div>
      </>
    );
  } else if (type === "detail") {
    return (
      <>
        <div className="h5">
          <h5>總金額</h5>
        </div>
        <div className="amount-list">
          <div className="pAmount">
            <p>商品總金額</p>
            <h6>${totalAmount}</h6>
          </div>
          <div className="cp-discount">
            <p>優惠券折抵</p>
            <h6>$0</h6>
          </div>
          <div className="t-line"></div>
          <div className="total">
            <h6>總金額</h6>
            <h4>${totalAmount}</h4>
          </div>
          <div className="total phone">
            <h6>總金額</h6>
            <h5>${totalAmount}</h5>
          </div>
        </div>
        <div className="nextOrBack">
          <GreenButton step={"前往下一步"} to={handleNext} />
          <WhiteButton step={"繼續購物"} to="/products" />
        </div>
        <div className="nextOrBack-phone">
          <WhiteButton step={"繼續購物"} to="/products" />
          <GreenButton step={"前往下一步"} to="/cart/detail" />
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="amount-list fin">
          <div className="pAmount">
            <p>商品總金額</p>
            <h6>${totalAmount}</h6>
          </div>
          <div className="cp-discount">
            <p>優惠券折抵</p>
            <h6>$0</h6>
          </div>
          <div className="t-line"></div>
          <div className="total">
            <h6>總金額</h6>
            <h6>${totalAmount}</h6>
          </div>
        </div>
      </>
    );
  }
}
