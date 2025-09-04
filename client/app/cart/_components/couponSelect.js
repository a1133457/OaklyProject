"use client"

import { useState } from "react";
import "@/styles/cart/couponSelect.css";

export default function CouponSelect({ coupons, onSelect }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    const handleSelect = (coupon) => {
        setSelectedCoupon(coupon);
        setIsOpen(false);
        if (onSelect) onSelect(coupon); // 回傳給父元件
    };

    return (
        <>
            {/* 按鈕可以放在 page 裡 */}
            <button onClick={() => setIsOpen(true)}>
                {selectedCoupon ? `已選擇: ${selectedCoupon.code}` : "選擇優惠券"}
            </button>

            {isOpen && (
                <div className="overlay">
                    <div className="modal">
                        {/* X 關閉按鈕 */}
                        <button className="closeButton" onClick={() => setIsOpen(false)}>
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                        <h3>選擇可用優惠券</h3>
                        <ul>
                            {coupons.map((coupon) => (
                                <li key={coupon.id}>
                                    <button
                                        className="couponButton"
                                        onClick={() => handleSelect(coupon)}
                                    >
                                        {coupon.code} - {coupon.desc}
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => setIsOpen(false)}>取消</button>
                    </div>
                </div>
            )}
        </>
    );
}