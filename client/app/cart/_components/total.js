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

export default function Total({ type, onClick }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = 1;


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


    // const {
    //     items,
    //     totalAmount,
    //     totalOty,
    //     onDecrease,
    //     onIncrease,
    //     onRemove,
    // } = useCart();

    // // 跳出確認訊息的函式
    // const confirmAndRemove = (cartItemName, itemId) => {
    //     // 包裝給 react 用的函式
    //     const MySwal = withReactContent(Swal);
    //     MySwal.fire({
    //         title: "確定要刪除嗎?",
    //         text: `${cartItemName} 將會從購物車中被刪除`,
    //         icon: "warning",
    //         showCancelButton: true,
    //         confirmButtonColor: '#3085d6',
    //         cancelButtonColor: '#d33',
    //         cancelButtonText: '取消',
    //         confirmButtonText: '確認刪除',
    //     }).then((result) => {
    //         if (result.isConfirmed) {
    //             // 進行刪除動作
    //             onRemove(itemId)

    //             // 跳出訊息
    //             MySwal.fire({
    //                 title: "已成功刪除",
    //                 text: `${cartItemName} 已經從購物車中被刪除`,
    //                 icon: "success",
    //             })
    //         }
    //     })
    // }

    if (type === "order") {
        return (
            <>

                <h5>總金額</h5>
                <div className="amount-list">
                    <div className="pAmount">
                        <p>商品總金額</p>
                        <h6>$1000</h6>
                    </div>
                    <div className="choose-cp">
                        <h6>選擇優惠券</h6>
                        <CouponSelect coupons={coupons} onSelect={handleSelectCoupon} />
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="fee">
                        <p>運費折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h6>總金額</h6>
                        <h6>$12,000</h6>
                    </div>
                    <div className="total phone">
                        <h3>總金額</h3>
                        <h3>$12,000</h3>
                    </div>
                </div>
                <div className="nextOrBack">
                    <GreenButton step={"前往下一步"} to="/cart/detail" />
                    <WhiteButton step={"繼續購物"} to="/product" />
                </div>
                <div className="nextOrBack-phone">
                    <WhiteButton step={"繼續購物"} to="/product" />
                    <GreenButton step={"前往下一步"} to="/cart/detail" />
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
                        <h6>$1000</h6>
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="fee">
                        <p>運費折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h6>總金額</h6>
                        <h6>$12,000</h6>
                    </div>
                    <div className="total phone">
                        <h6>總金額</h6>
                        <h5>$12,000</h5>
                    </div>
                </div>
                <div className="nextOrBack">
                    <GreenButton step={"前往下一步"}  onClick={handleSubmit}/>
                    <WhiteButton step={"繼續購物"} />
                </div>
                <div className="nextOrBack-phone">
                    <WhiteButton step={"繼續購物"} />
                    <GreenButton step={"前往下一步"} onClick={handleSubmit} />
                </div>
            </>
        )

    } else {
        return (
            <>
                <div className="amount-list fin">
                    <div className="pAmount">
                        <p>商品總金額</p>
                        <h6>$1000</h6>
                    </div>
                    <div className="cp-discount">
                        <p>優惠券折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="fee">
                        <p>運費折抵</p>
                        <h6>$0</h6>
                    </div>
                    <div className="t-line"></div>
                    <div className="total">
                        <h6>總金額</h6>
                        <h6>$12,000</h6>
                    </div>
                </div>

            </>
        )
    }



}