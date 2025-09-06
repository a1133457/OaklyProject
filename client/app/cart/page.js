"use client";

import CartCard from "./_components/cartCard";
import Gradation from "./_components/gradation";
import Total from "./_components/total";
import "@/styles/cart/cartOrder.css";
import Image from "next/image";


export default function CartOrderPage() {
  return (
    <div className="container-fluid">
      <Gradation step="order"/>
      <div className="cart">
        <div className="left-side">
          <div className="cart-main-title">
            <div className="choose-all">
              <input type="checkbox" placeholder="選擇全部" />
              <h6>選擇全部</h6>
            </div>
            <button>
              <i className="fa-solid fa-trash"></i>刪除
            </button>
          </div>
          <div className="cart-main-first">
            <h4>訂單資訊</h4>
            <CartCard type="order" />
          </div>
        </div>
        <div className="orange-side">
          <Total type="order" />
        </div>
      </div>
    </div>
  );
}
