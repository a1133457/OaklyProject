"use client"

import GreenButton from "./greenButton"
import WhiteButton from "./whiteButton"
import "@/styles/cart/total.css";
// 導入 useCart
import { useCart } from "@/hooks/use-cart"
// sweetalert2
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import CouponSelect from "./couponSelect";
import { useEffect, useState } from "react";

export default function Total({ type }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1; // 之後要刪除
    const { items, onDecrease, onIncrease, onRemove, totalQty, totalAmount } = useCart();


    const fetchCoupons = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/counpons/${userId}`);
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            setError("無法載入優惠券");
            console.log(error);

        }
    }

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchCoupons()]);
        };
        loadData();
    }, [userId])

    const handleSelectCoupon = (coupon) => {
        console.log("選擇的優惠券:", coupon);
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
            })

            document.body.appendChild(form);
            form.submit();
        }
    }

    if (type === "order") {
        return (
            <>

                <h5>總金額</h5>
                <div className="amount-list">
                    <div className="pAmount">
                        <p>商品總金額</p>
                        <h6>{totalAmount}</h6>
                    </div>
                    <div className="choose-cp">
                        <p>選擇優惠券</p>
                        <CouponSelect coupons={coupons} onSelect={handleSelectCoupon} />
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h5>總金額</h5>
                        <h4>{totalAmount}</h4>
                    </div>
                    <div className="total phone">
                        <h3>總金額</h3>
                        <h3>{totalAmount}</h3>
                    </div>
                </div>
                <div className="nextOrBack">
                    <GreenButton step={"前往下一步"} to="/cart/detail" type="order"/>
                    <WhiteButton step={"繼續購物"} to="/products" />
                </div>
                <div className="nextOrBack-phone">
                    <WhiteButton step={"繼續購物"} to="/products"/>
                    <GreenButton step={"前往下一步"} to="/cart/detail" type="order"/>
                </div>
            </>
        )
    } else if (type === "detail") {
        return (
            <>
                <div className="h5">
                    <h5>總金額</h5>
                </div>
                <div className="amount-list">
                    <div className="pAmount">
                        <p>商品總金額</p>
                        <h6>{totalAmount}</h6>
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h6>總金額</h6>
                        <h4>{totalAmount}</h4>
                    </div>
                    <div className="total phone">
                        <h6>總金額</h6>
                        <h5>{totalAmount}</h5>
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
        )

    } else {
        return (
            <>
                <div className="amount-list fin">
                    <div className="pAmount">
                        <p>商品總金額</p>
                        <h6>{totalAmount}</h6>
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h6>總金額</h6>
                        <h6>{totalAmount}</h6>
                    </div>
                </div>

            </>
        )
    }



}