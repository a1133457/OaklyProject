"use client"

import React, { useRef } from "react";
import { isDev, apiURL } from '@/config/client.config'; //要建一個 config
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';//要件 ToastContainer
import 'react-toastify/dist/ReactToastify.css'; //css
import { useAuth } from '@/hooks/use-auth'; // 引入會員資訊
import { useCart } from '@/hooks/use-cart'; //引入購物車

export default function EcpayPage() {
    // 檢查是否登入
    const { isAuth } = useAuth();
    // 從購物車取得資料
    const { items, total } = useCart();

    // 建立 ref，用來放置 form 表單
    const payFormDiv = useRef(null);

    // 建立 ref，用來放置金額
    // const amountRef = useRef(null);
    // 建立 ref，用來放置商品名稱
    // const itemsRef = useRef(null);

    // 把購物車轉成 ECPay 需要的商品字串
    const buildItemsString = () => {
        return items.map((item) => `${item.name}x${item.quantity}`).join('.');
    }

    // 建立 form 表單
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
        // 回傳 form 表單的物件參照
        return payFormDiv.current.appendChild(form);
        // 以下是直接送出表單的方式
        // form.submit()
    }
    const handleEcpay = async () => {
        if (items.length === 0) {
            toast.error("購物車是空的");
            return
        }
        try {
            // 先連到 node 伺服器後端，取得 ECPay付款網址
            const res = await fetch(
                `${apiURL}/payment/ecpay`,
                {
                    method: "POST", //用 POST，比較安全
                    // 讓 fetch 能夠傳送 cookie
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        amount: total,
                        items: buildItemsString(),
                    }),
                }
            )
            const resData = await res.json();

            if (isDev) console.log(resData);

            if (resData.status === "success") {
                // 建立表單，回傳的是表單的物件參照
                const payForm = createEcpayForm(resData.data.params, resData.data.action);

                if (isDev) console.log(payForm);

                if (window.confirm("確認要導向至 ECPay (綠界金流)進行付款?")) {
                    // 送出表單
                    payForm.submit();
                }
            } else {
                toast.error("付款失敗")
            }
        } catch (err) {
            console.error(err);
            toast.error("系統錯誤，請稍後再試")
        }
    }
    return (
        <>
            <h1>E</h1>
        </>
    )
}