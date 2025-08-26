"use client"

import CartCard from "./_components/cartCard";
import Total from "./_components/total";
import "@/styles/cart/cartOrder.css"
import Image from "next/image";

export default function CartOrderPage() {
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
                    <div className="top-line2"></div>
                    <div className="name">
                        <div className="round2">2</div>
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
                    <div className="cart-main-title">
                        <div className="choose-all">
                            <input type="checkbox" placeholder="選擇全部" />
                            <h6>選擇全部</h6>
                        </div>
                        <button><i className="fa-solid fa-trash"></i>刪除</button>
                    </div>
                    <div className="cart-main-first">
                    <CartCard type="order"/>
                    </div>
                </div>
                <div className="orange-side">
                   <Total type="order"/>
                </div>
            </div>
        </div>
    )
}