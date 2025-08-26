"use client"

import GreenButton from "./greenButton"
import WhiteButton from "./whiteButton"
import "@/styles/cart/total.css";

export default function Total({ type }) {
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
                        <button>Coupons</button>
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
                        <h3>$12,000</h3>
                    </div>
                </div>
                <div className="nextOrBack">
                    <GreenButton step={"前往下一步"} to="/cart/detail"/>
                    <WhiteButton step={"繼續購物"} to="/product"/>
                </div>
                <div className="nextOrBack-phone">
                    <WhiteButton step={"繼續購物"} to="/product"/>
                    <GreenButton step={"前往下一步"} to="/cart/detail"/>
                </div>
            </>
        )
    } else if (type === "detail") {
        return (
            <>

                <h5>總金額</h5>
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
                </div>
                <div className="nextOrBack">
                    <GreenButton step={"前往下一步"} />
                    <WhiteButton step={"繼續購物"} />
                </div>
            </>
        )

    } else {
        return (
            <>
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
                </div>

            </>
        )
    }



}