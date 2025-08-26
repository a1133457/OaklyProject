"use client"

import Total from "../_components/total";
import ContactPerson from "../_components/contactPerson";
import Image from "next/image";
import Delivery from "../_components/delivery";
import Payment from "../_components/payment";
import "@/styles/contactPerson.css";
import "@/styles/cart/delivery.css";
import "@/styles/cart/payment.css";

export default function CartDetailPage() {
    return (
        <div className="container-fluid">
            <div className="top">
                <div className="cart-title">
                    <h2>購物車</h2>
                </div>
                <div className="gradation">
                    {/* 有重複------------------------- */}
                    <div className="name">
                        <div className="round1">1</div>
                        <h5>訂單資訊</h5>
                    </div>
                    <div className="top-line1"></div>
                    <div className="name">
                        <div className="round1">2</div>
                        <h5>填寫地址與付款</h5>
                    </div>
                    <div className="top-line2"></div>
                    <div className="name">
                        <div className="round2">3</div>
                        <h5>完成訂單</h5>
                    </div>
                    {/* ------------------------------ */}
                </div>
            </div>
            <div className="cart">
                <div className="left-side">
                    <div className="cart-main-first">
                    <ContactPerson
                        name={"王大明"}
                        phone={"0909123456"}
                        email={"aa111@gmail.com"}
                        address={"320桃園市中壢區新生路二段421號"}
                    />
                    </div>
                    <div className="cart-main-first">
                    <Delivery/>
                    </div>
                    <div className="cart-main-first">
                    <Payment/>
                    </div>
                </div>
                <div className="orange-side">
                   <Total type="detail"/>
                </div>
            </div>
        </div>
    )
}