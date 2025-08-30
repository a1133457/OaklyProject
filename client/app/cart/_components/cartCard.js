"use client";

import "@/styles/cart/cartCard.css";
import { useState } from "react";

export default function CartCard({ type }) {
  const [showForm, setShowForm] = useState(false);

  if (type === "order") {
    return (
      <>
        <div className="cart-card">
          <div className="cart-main">
            <div className="card-left">
              <input type="checkbox" />
              <img src="/img/red.webp" alt="red" width={150} height={150} />
              <div className="card-title">
                <h6>
                  北歐極簡風格可調式高背人體工學多段傾斜頭枕扶手全實木結構布面透氣可拆洗懶人休閒電動搖椅（附腳凳＋USB充電孔＋杯架）居家工作兩用型多功能設計沙發椅
                </h6>
                <p>顏色</p>
              </div>
            </div>
            <div className="card-right">
              <button className="buttonX">
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="price-num">
                <h4>$1000</h4>
                <div className="quantity">
                  <button className="minus">
                    <i className="fa-solid fa-minus"></i>
                  </button>
                  <div className="num">1</div>
                  <button className="plus">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="cart-line"></div>
        </div>
        {/* 手機-------------------------- */}
        <div className="cart-line phone"></div>
        <div className="cart-card phone">
          <div className="cart-main phone">
            <div className="card-left">
              <input type="checkbox" />
              <img src="/img/red.webp" alt="red" />
              <div className="card-title">
                <h6>
                  北歐極簡風格可調式高背人體工學多段傾斜頭枕扶手全實木結構布面透氣可拆洗懶人休閒電動搖椅（附腳凳＋USB充電孔＋杯架）居家工作兩用型多功能設計沙發椅
                </h6>
                <p>顏色</p>
                <div className="price-one">
                  <h4>$1000</h4>
                  <div className="quantity">
                    <button className="minus">
                      <i className="fa-solid fa-minus"></i>
                    </button>
                    <div className="num">1</div>
                    <button className="plus">
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
                <h4>$1000</h4>
              </div>
            </div>
          </div>
          <div className="cart-line phone"></div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="cart-card pc">
          <div className="cart-main">
            <div className="card-left">
              <img src="/img/red.webp" alt="red" width={150} height={150} />
              <div className="card-title">
                <h5>
                  北歐極簡風格可調式高背人體工學多段傾斜頭枕扶手全實木結構布面透氣可拆洗懶人休閒電動搖椅（附腳凳＋USB充電孔＋杯架）居家工作兩用型多功能設計沙發椅
                </h5>
                <p>顏色</p>
              </div>
            </div>
            <div className="card-right">
              <h3>$1000</h3>
              <div className="quantity">數量: 1</div>
            </div>
          </div>
        </div>
        {/* 手機-------------------------- */}
        <div className="cart-line phone"></div>
        <div className="cart-card phone">
          {showForm && (
            <>
              <div className={`toggle-content ${showForm ? "open" : ""} phone`} >
                <div className="cart-main phone">
                  <div className="card-left">
                    <img src="/img/red.webp" alt="red" />
                    <div className="card-title detail">
                      <h6>
                        北歐極簡風格可調式高背人體工學多段傾斜頭枕扶手全實木結構布面透氣可拆洗懶人休閒電動搖椅（附腳凳＋USB充電孔＋杯架）居家工作兩用型多功能設計沙發椅
                      </h6>
                      <p>顏色</p>
                      <h4>$1000</h4>
                    </div>
                  </div>
                </div>
                <div className="cart-line phone"></div>
              </div>

            </>
          )}
          <div className="totalNumPrice phone">
            <h6>訂單金額(2)</h6>
            <div className="total-price phone">
              <h6>合計</h6>
              <h4>$400</h4>
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
}
