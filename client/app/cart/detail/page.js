"use client"

import Total from "../_components/total";
import ContactPerson from "../_components/contactPerson";
import Delivery from "../_components/delivery";
import Payment from "../_components/payment";
import Gradation from "../_components/gradation";
import "@/styles/cart/cartOrder.css";
import CartCard from "../_components/cartCard";




export default function CartDetailPage() {
    return (
        <div className="container-fluid">
            <Gradation step="detail" />
                <CartCard />
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
                        <Delivery />
                    </div>
                    <div className="cart-main-first">
                        <Payment />
                    </div>
                </div>
                <div className="orange-side">
                    <Total type="detail" />
                </div>
            </div>
        </div>
    )
}