"use client";

import "@/styles/cart/cartCard.css";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

export default function CartCard({ type }) {
  const [showForm, setShowForm] = useState(false);
  const { items, onDecrease, onIncrease, onRemove, totalQty, totalAmount } = useCart();
  if (items) {
    if (type === "order") {
      return (
        <>
          <div className="cart-card">
            {items.map((item) => (
              <div key={item.id} className="cart-main">
                <div className="card-left">
                  <input type="checkbox" />
                  <img src={`/img/${item.img}`} alt={item.name} width={150} height={150} />
                  <div className="card-title">
                    <h6>
                      {item.name}
                    </h6>
                    <p>顏色: {item.color}</p>
                    <p>size: {item.size}</p>
                    <p>材質: {item.material}</p>
                  </div>
                </div>
                <div className="card-right">
                  <button onClick={() => onRemove(item.id)} className="buttonX">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <div className="price-num">
                    <h4>{item.price}</h4>
                    <div className="quantity">
                      <button onClick={() => onDecrease(item.id)} className="minus">
                        <i className="fa-solid fa-minus"></i>
                      </button>
                      <div className="num">{item.quantity}</div>
                      <button onClick={() => onIncrease(item.id)} className="plus">
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
            <div className="cart-line"></div>
          </div>
          {/* 手機-------------------------- */}
          <div className="cart-line phone"></div>
          <div className="cart-card phone">
            {items.map((item) => (
              <div key={item.id} className="cart-main phone">
                <div className="card-left">
                  <input type="checkbox" />
                  <img src={`/img/${item.img}`} alt={item.name} width={100} height={95} />
                  <div className="card-title">
                    <h6>
                      {item.name}
                    </h6>
                    <p>顏色: {item.color}</p>
                    <p>size: {item.size}</p>
                    <p>材質: {item.material}</p>
                    <div className="price-one">
                      <h4>${item.price}</h4>
                      <div className="quantity">
                        <button onClick={() => onDecrease(item.id)} className="minus">
                          <i className="fa-solid fa-minus"></i>
                        </button>
                        <div className="num">{item.quantity}</div>
                        <button onClick={() => onIncrease(item.id)} className="plus">
                          <i className="fa-solid fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-right">
                  <button className="buttonX">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <div className="price-num">
                    <h4>${item.price * item.quantity}</h4>
                  </div>
                </div>
              </div>
            ))}
            <div className="cart-line phone"></div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div className="cart-card pc">
            {items.map((item) => (
              <div key={item.id} className="cart-main">
                <div className="card-left">
                  <img src={`/img/${item.img}`} alt={item.name} width={150} height={150} />
                  <div className="card-title">
                    <h5>
                      {item.name}
                    </h5>
                    <p>顏色: {item.color}</p>
                    <p>size: {item.size}</p>
                    <p>材質: {item.material}</p>
                  </div>
                </div>
                <div className="card-right">
                  <h3>${item.price * item.quantity}</h3>
                  <div className="quantity">數量: {item.quantity}</div>
                </div>
              </div>
            ))}
          </div>
          {/* 手機-------------------------- */}
          <div className="cart-line phone"></div>
          <div className="cart-card phone">
            {showForm && (
              <>
                <div className={`toggle-content ${showForm ? "open" : ""} phone`} >
                  {items.map((item) => (
                    <div key={item.id} className="cart-main phone">
                      <div className="card-left">
                        <img src={`/img/${item.img}`} alt={item.name} width={150} height={150} />
                        <div className="card-title detail">
                          <h6>
                            {item.name}
                          </h6>
                          <p>顏色: {item.color}</p>
                          <p>size: {item.size}</p>
                          <p>材質: {item.material}</p>
                          <h4>${item.price * item.quantity}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="cart-line phone"></div>
                </div>

              </>
            )}
            <div className="totalNumPrice phone">
              <h6>訂單金額({totalQty})</h6>
              <div className="total-price phone">
                <h6>合計</h6>
                <h4>{totalAmount}</h4>
              </div>
            </div>
          </div >
          <button className="toggleBtn1 card phone"
            onClick={() => {
              setShowForm(!showForm);
            }}
            id="toggleBtn"
          >
            {showForm ? "收合清單" : "展開清單"}
          </button>

        </>
      );
    }
  } else {
    return (
      <div className="noProduct">
        <h6>目前沒有商品</h6>
      </div>
    )
  }
}
