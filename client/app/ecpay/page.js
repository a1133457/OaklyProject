"use client"

import React, {useRef} from "react";
import { isDev, apiURL } from '@/config/client.config'; //要建一個 config
import Link from 'next/link';
import { toast, ToastContainer } from 'react-toastify';//要件 ToastContainer
import 'react-toastify/dist/ReactToastify.css'; //css
import { useAuth } from '@/hooks/use-auth';

export default function EcpayPage(){
    // 檢查是否登入
    const {isAuth } =useAuth();
    // 建立 ref，用來放置 form 表單
    const payFormDiv = useRef(null);
    // 建立 ref，用來放置金額
    const amountRef = useRef(null);
    // 建立 ref，用來放置商品名稱
    const itemsRef = useRef(null);

    // 建立 form 表單
    const createEcpayForm = (params, action)=>{
        const form = document.createElement("form");
        form.method = "POST";
        form.action = action;
        for(const key in params){
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
    const handleEcpay = async()=>{
        // 先連到 node 伺服器後端，取得 ECPay付款網址
        const res = await fetch(
            `${apiURL}/payment/ecpay?amount=${amountRef.current.value}&items=${itemsRef.current.value}`,
            {
                method: "GET",
                // 讓 fetch 能夠傳送 cookie
                credentials: "include",
                headers:{
                    "Content-Type": "application/json",
                    Accept: "application/json",
                }
            }
        )

        const resData = await res.json();
        if(isDev) console.log(resData);

        if(resData.status === "success"){
            // 建立表單，回傳的是表單的物件參照
            const payForm = createEcpayForm(resData.data.params, resData.data.action);

            if(isDev) console.log(payForm);

            if(window.confirm("確認要導向至 ECPay (綠界金流)進行付款?")){
                // 送出表單
                payForm.submit();
            }
        }else{
            toast.error("付款失敗")
        }
        
    }
    return (
        <>
            <h1>E</h1>
        </>
    )
}