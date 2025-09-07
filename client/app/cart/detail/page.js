"use client";

import Total from "../_components/total";
import ContactPerson from "../_components/contactPerson";
import Delivery from "../_components/delivery";
import Payment from "../_components/payment";
import Gradation from "../_components/gradation";
import "@/styles/cart/cartOrder.css";
import "@/styles/cart/cartDetail.css";
import CartCard from "../_components/cartCard";

import { useState, useRef } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CartDetailPage() {
  const [buyerName, setBuyName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [address, setAddress] = useState("");
  const [items, setItems] = useState([]);
  const payFormDiv = useRef(null);

  const createEcpayForm = (params, action) => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = action;
    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }
    return payFormDiv.current.appendChild(form);
  };

  const handleSubmit = async () => {
    if (!name || !address || !email || !phone) {
      toast.error("請填寫完整資料");
    }

    try {
      const res = await fetch("api/order/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1,
          totalAmount: items.reduce((a, b) => a + b.price * b.quantity, 0),
          buyer_name: buyerName,
          buyer_email: buyerEmail,
          buyer_phone: buyerPhone,
          recipient_name: recipientName,
          recipient_phone: recipientPhone,
          postal_code: postalCode,
          address,
          items,
        }),
      });

      const data = await res.json();
      if (data.status === "success") {
        const form = createEcpayForm(
          data.ecpayParams,
          "http://payment.ecpay.com.tw/Cashier/Aiocheckout/VS"
        );
        form.submit();
      } else {
        toast.error(data.message || "訂單建立失敗");
      }
    } catch (error) {
      toast.error("系統錯誤");
      console.error(error);
    }
  };

  return (
    <div className="container-fluid">
      <Gradation step="detail" />
      <div className="cart-main detail phone">
        <h4>訂單資訊</h4>
        <CartCard />
      </div>

      <div className="cart">
        <div className="left-side">
          <div className="cart-main-first">
            <ContactPerson/>
          </div>
          <div className="cart-main-first">
            <Delivery />
          </div>
          <div className="cart-main-first">
            <Payment />
          </div>
        </div>
        <div className="orange-side">
          <Total type="detail" onClick={handleSubmit}/>
        </div>
      </div>
    </div>
  );
}
