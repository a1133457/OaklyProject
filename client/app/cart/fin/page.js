"use client"

import CartCard from "../_components/cartCard";
import Gradation from "../_components/gradation";
import GreenButton from "../_components/greenButton";
import Total from "../_components/total";
import WhiteButton from "../_components/whiteButton";
import "@/styles/cart/cartFin.css";

export default function CartFinPage() {
    return (
        <div className="container-fluid">
           <Gradation/>
            <div className="cart">
                <div className="main-side">
                    <div className="cart-main-first">
                        <h2>完成訂單</h2>
                        <i className="fa-regular fa-circle-check"></i>
                        <h4>您的訂單已成功成立，我們將盡快為您處理！</h4>
                    </div>
                    <div className="cart-main-first fin-card">
                        <h4>訂單編號: 14356457856</h4>
                        <CartCard />
                        <div className="orange-side">
                            <div className="used-coupons">
                                <h6>此訂單使用的優惠券</h6>

                            </div>
                            <Total />
                        </div>
                    </div>
                    <div className="cart-main-first fin-card">
                        <h4>訂單資訊</h4>
                        <div className="fin-info">
                            <div className="orange-side">
                                <div className="information">
                                    <div className="info-1">
                                        <h6>成立時間</h6>
                                        <h6>付款狀態</h6>
                                        <h6>付款方式</h6>
                                        <h6>配送方式</h6>
                                    </div>
                                    <div className="info-2">
                                        <p>2025-08-10 15:23</p>
                                        <p>已付款</p>
                                        <p>信用卡</p>
                                        <p>7-ELEVEN 取貨</p>
                                    </div>
                                </div>
                            </div>
                            <div className="orange-side">
                                <div className="information">
                                    <div className="info-1">
                                        <h6>收件人</h6>
                                        <h6>收件人電話</h6>
                                        <h6>取件門市</h6>
                                        <h6>門市地址</h6>
                                    </div>
                                    <div className="info-2">
                                        <p>全圓佑</p>
                                        <p>(+886) 912345678</p>
                                        <p>東西門市</p>
                                        <p>320 桃園市中壢區新生路二段421號</p>
                                    </div>
                                  
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-button">
                        <WhiteButton step="檢視訂單詳情"/>
                        <GreenButton step="繼續購物"/>
                    </div>
                </div>
            </div>
        </div>
    )
}