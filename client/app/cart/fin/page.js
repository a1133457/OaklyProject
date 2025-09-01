"use client"

import Link from "next/link";
import CartCard from "../_components/cartCard";
import Gradation from "../_components/gradation";
import GreenButton from "../_components/greenButton";
import Total from "../_components/total";
import WhiteButton from "../_components/whiteButton";
import "/styles/cart/cartFin.css";

export default function CartFinPage() {
    return (
        <div className="container-fluid">
            <Gradation />
            <div className="cart">
                <div className="main-side pc">
                    <div className="cart-main-first pc">
                        <h2>完成訂單</h2>
                        <i className="fa-regular fa-circle-check"></i>
                        <h4>您的訂單已成功成立，我們將盡快為您處理！</h4>
                    </div>
                    <div className="cart-main-first fin-card pc">
                        <h4>訂單編號: 14356457856</h4>
                        <CartCard />
                        <div className="orange-side pc">
                            <div className="used-coupons pc">
                                <h6>此訂單使用的優惠券</h6>

                            </div>
                            <Total />
                        </div>
                    </div>
                    <div className="cart-main-first fin-card pc">
                        <h4>訂單資訊</h4>
                        <div className="fin-info pc">
                            <div className="orange-side pc">
                                <div className="information pc">
                                    <div className="info-1 pc">
                                        <h6>成立時間</h6>
                                        <h6>付款狀態</h6>
                                        <h6>付款方式</h6>
                                    </div>
                                    <div className="info-2 pc">
                                        <p>2025-08-10 15:23</p>
                                        <p>已付款</p>
                                        <p>信用卡</p>
                                    </div>
                                </div>
                            </div>
                            <div className="orange-side pc">
                                <div className="information pc">
                                    <div className="info-1 pc">
                                        <h6>收件人</h6>
                                        <h6>收件人電話</h6>
                                        <h6>取件門市</h6>
                                        <h6>門市地址</h6>
                                    </div>
                                    <div className="info-2 pc">
                                        <p>全圓佑</p>
                                        <p>(+886) 912345678</p>
                                        <p>東西門市</p>
                                        <p>320 桃園市中壢區新生路二段421號</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="info-button pc">
                        <WhiteButton step="檢視訂單詳情" />
                        <GreenButton step="繼續購物" />
                    </div>
                </div>
                {/* 手機---------------------------- */}
                <div className="main-side phone">
                    <div className="cart-main-first phone">
                        <h2>完成訂單</h2>
                        <i className="fa-regular fa-circle-check"></i>
                    </div>
                    <div className="cart-main-first fin-card phone">
                        <table className="fin-card-table">
                            <tbody>
                                <tr>
                                    <th className="fin-card-title">
                                        <i className="fa-solid fa-list-ul"></i>
                                        <h6>訂單資訊</h6>
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        <table className="fin-card-details">
                                            <tbody>
                                                <tr>
                                                    <td>訂單編號</td>
                                                    <td>14356457856</td>
                                                </tr>
                                                <tr>
                                                    <td>訂單名稱</td>
                                                    <td className="detail-name">
                                                        北歐極簡風格可調式高背人體工學多段傾斜頭枕扶手全實木結構布面透氣可拆洗懶人休閒電動搖椅（附腳凳＋USB充電孔＋杯架）居家工作兩用型多功能設計沙發椅
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>訂單數量</td>
                                                    <td>x1</td>
                                                </tr>
                                                <tr>
                                                    <td>詳細資訊</td>
                                                    <td>
                                                        <Link href="#" alt="">
                                                            前往查看
                                                        </Link>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <th className="fin-card-title">
                                        <i className="fa-regular fa-credit-card"></i>
                                        <h6>付款資訊</h6>
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        <table className="fin-card-details">
                                            <tbody>
                                                <tr>
                                                    <td>付款方式</td>
                                                    <td>信用卡</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="info-button">
                                        <WhiteButton step="繼續選購" />
                                        <p>感謝訂購 Oakly 的商品，已完成交易，
                                            我們會為您盡快處理</p>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}